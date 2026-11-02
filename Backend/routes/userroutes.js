const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const db = require("../db");

const fs = require("fs");
const fallbackCategories = require("../data/category.json");
const fallbackTeam = require("../data/team_members.json");
const fallbackOrders = require("../data/case_orders.json");

// Ensure upload directories exist
const imagesDir = path.join(__dirname, "../images");
const pdfsDir = path.join(__dirname, "../pdfs");
if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });
if (!fs.existsSync(pdfsDir)) fs.mkdirSync(pdfsDir, { recursive: true });

// ---- Multer Storage (single config for all uploads) ----
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.includes("pdf") || (file.originalname && file.originalname.toLowerCase().endsWith(".pdf"))) {
      cb(null, pdfsDir);
    } else {
      cb(null, imagesDir);
    }
  },
  filename: (req, file, cb) => {
    const cleanName = (file.originalname || "file").replace(/[^a-zA-Z0-9.-]/g, "_");
    cb(null, Date.now() + "-" + cleanName);
  }
});
const upload = multer({ storage });

//✅ ADD REGISTER       
router.post("/registration/add", (req, res) => {
    const { Sname, Phone, Email, Cases, Uname, Password } = req.body;

    if (!Sname || !Phone || !Email || !Uname || !Password) {
        return res.status(400).json({ message: "Please fill all required fields (Name, Phone, Email, Username, Password)." });
    }

    const sql = "INSERT INTO registration SET ?";
    db.query(sql, { Sname, Phone, Email, Cases: Cases || "", Uname, Password }, (err, result) => {
        if (err) {
            console.error("Registration error:", err);
            if (err.code === "ER_DUP_ENTRY") {
                const msg = err.sqlMessage || "";
                if (msg.toLowerCase().includes("email")) {
                    return res.status(400).json({ message: "This Email is already registered. Please use another email." });
                }
                if (msg.toLowerCase().includes("uname")) {
                    return res.status(400).json({ message: "This Username is already taken. Please choose another username." });
                }
                return res.status(400).json({ message: "Username or Email is already registered." });
            }
            return res.status(500).json({ message: err.sqlMessage || "Database error occurred." });
        }

        res.status(201).json({
            message: "User Added Successfully",
            userId: result.insertId,
        });
    });
});
// ✅ GET USER BY ID
router.get("/registration/:id", (req, res) => 
  {
  const sql = "SELECT * FROM registration WHERE id = ?";

  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length === 0) 
      {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result[0]);
  });
});
 
// ✅ LOGIN
router.post("/login", (req, res) => 
  {
  const { Uname, Password } = req.body;

  const sql = "SELECT * FROM registration WHERE Uname = ? AND Password = ?";

  db.query(sql, [Uname, Password], (err, result) =>
     {
    if (err) return res.status(500).json({ message: "Server error" });

    if (result.length > 0) 
      {
      res.json(
        {
        userId: result[0].id,
      });
    } else 
      {
      res.status(401).json({ message: "Invalid username or password" });
    }
  });
}); 

// ✅ UPDATE USER BY ID
router.put("/registration/edit/:id", (req, res) => {
  const { id } = req.params;
  const { Sname, Phone, Email, Cases, Uname, Password } = req.body;

  const sql = `
    UPDATE registration 
    SET Sname = ?, Phone = ?, Email = ?, Cases = ?, Uname = ?, Password = ?
    WHERE id = ?
  `;

  db.query(sql, [Sname, Phone, Email, Cases, Uname, Password, id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User Updated Successfully" });
  });
});

// ✅ DELETE USER BY ID
router.delete("/registration/delete/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM registration WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User Deleted Successfully" });
  });
});


// ---- CATEGORY ROUTES ----
router.get("/category", (req, res) => {
  db.query("SELECT category_id, category_name, description, image_url, parent_id FROM category ORDER BY category_id DESC", (err, result) => {
    if (err || !result || result.length === 0) return res.json(fallbackCategories);
    res.json(result);
  });
});

router.post("/category", upload.single("image"), (req, res) => {
  const { category_name, parent_id, description } = req.body;
  if (!category_name || !category_name.trim()) {
    return res.status(400).json({ error: "Category Name is required" });
  }

  const image_url = req.file ? "images/" + req.file.filename : (req.body.image_url || "");
  const cleanParentId = (parent_id && !isNaN(parent_id) && String(parent_id).trim() !== "") ? parseInt(parent_id) : null;

  db.query(
    "INSERT INTO category(category_name, parent_id, description, image_url) VALUES (?, ?, ?, ?)",
    [category_name.trim(), cleanParentId, description || "", image_url],
    (err, result) => {
      if (err) {
        console.error("Error adding category:", err);
        return res.status(500).json({ error: err.sqlMessage || "Failed to add category" });
      }
      res.json({ success: true, id: result.insertId, category_name, parent_id: cleanParentId, description, image_url });
    }
  );
});

router.put("/category/:id", upload.single("image"), (req, res) => {
  const { id } = req.params;
  const { category_name, parent_id, description } = req.body;
  let image_url = req.body.image_url || "";

  if (req.file) image_url = "images/" + req.file.filename;

  const cleanParentId = (parent_id && !isNaN(parent_id) && String(parent_id).trim() !== "") ? parseInt(parent_id) : null;

  db.query(
    "UPDATE category SET category_name=?, parent_id=?, description=?, image_url=? WHERE category_id=?",
    [category_name, cleanParentId, description || "", image_url, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.sqlMessage || "Failed to update category" });
      res.json({ message: "Category updated successfully" });
    }
  );
});

router.delete("/category/:id", (req, res) => {
  db.query("DELETE FROM category WHERE category_id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.sqlMessage || "Failed to delete category" });
    res.json({ message: "Category deleted successfully" });
  });
});

// ---- TEAM MEMBERS ROUTES ----
router.get("/team_members", (req, res) => {
  db.query("SELECT * FROM team_members ORDER BY id DESC", (err, results) => {
    if (err || !results || results.length === 0) return res.json(fallbackTeam);
    res.json(results);
  });
});

router.post("/team_members", upload.single("image"), (req, res) => {
  const { name, role, description } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Member Name is required" });
  }

  const image_url = req.file ? "images/" + req.file.filename : (req.body.image_url || "");
  db.query(
    "INSERT INTO team_members (name, role, description, image_url) VALUES (?, ?, ?, ?)",
    [name.trim(), role || "", description || "", image_url],
    (err, result) => {
      if (err) {
        console.error("Error adding team member:", err);
        return res.status(500).json({ error: err.sqlMessage || "Failed to add team member" });
      }
      res.json({ success: true, id: result.insertId, name, role, description, image_url });
    }
  );
});

router.put("/team_members/:id", upload.single("image"), (req, res) => {
  const { id } = req.params;
  const { name, role, description } = req.body;
  let image_url = req.body.image_url || "";

  if (req.file) image_url = "images/" + req.file.filename;

  db.query(
    "UPDATE team_members SET name=?, role=?, description=?, image_url=? WHERE id=?",
    [name, role || "", description || "", image_url, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.sqlMessage || "Failed to update team member" });
      res.json({ message: "Team member updated successfully" });
    }
  );
});

router.delete("/team_members/:id", (req, res) => {
  db.query("DELETE FROM team_members WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.sqlMessage || "Failed to delete team member" });
    res.json({ message: "Team member deleted successfully" });
  });
});

// ---- CASE ORDERS ROUTES ----
router.get("/case_orders", (req, res) => {
  db.query("SELECT * FROM case_orders ORDER BY id DESC", (err, rows) => {
    if (err || !rows || rows.length === 0) return res.json(fallbackOrders);
    res.json(rows);
  });
});

router.post("/case_orders", upload.fields([{ name: "image_url", maxCount: 1 }, { name: "pdf_url", maxCount: 1 }]), (req, res) => {
  const { name, case_title, description, order_date } = req.body;
  if (!name || !case_title) {
    return res.status(400).json({ error: "Name and Case Title are required" });
  }

  const files = req.files || {};
  const imagePath = (files.image_url && files.image_url[0]) ? "images/" + files.image_url[0].filename : (req.body.image_url || "");
  const pdfPath = (files.pdf_url && files.pdf_url[0]) ? "pdfs/" + files.pdf_url[0].filename : (req.body.pdf_url || "");

  if (!pdfPath) {
    return res.status(400).json({ error: "PDF file is required for Case Orders" });
  }

  db.query(
    "INSERT INTO case_orders (name, case_title, image_url, pdf_url, description, order_date, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())",
    [name.trim(), case_title.trim(), imagePath, pdfPath, description || "", order_date || null],
    (err, result) => {
      if (err) {
        console.error("Error inserting case order:", err);
        return res.status(500).json({ error: err.sqlMessage || "Failed to insert case order" });
      }
      res.json({ success: true, id: result.insertId, message: "Case Order added successfully" });
    }
  );
});

// DELETE order
router.delete("/case_orders/:id", (req, res) => {
  db.query("DELETE FROM case_orders WHERE id = ?", [req.params.id], (err) => {
    if (err) {
      console.error("Error deleting case order:", err);
      return res.status(500).json({ error: err.sqlMessage || "Failed to delete case order" });
    }
    res.json({ success: true, message: "Case Order deleted successfully" });
  });
});

// ---- APPOINTMENT ROUTES ----
// ✅ GET all appointments
router.get("/appointment_form", (req, res) => {
  const sql = "SELECT * FROM appointment_form ORDER BY id DESC";
  db.query(sql, (err, result) => {
    if (err || !result || result.length === 0) return res.json([]);
    res.json(result);
  });
});

// Common handler for adding appointment (supports both /appointment_form and /appointment_form/add)
const handleAddAppointment = (req, res) => {
  const { name, email, mobile, case_type, message } = req.body;

  if (!name || !email || !mobile || !case_type || !message) {
    return res.status(400).json({ 
      error: "All fields are required: Name, Email, Mobile, Case Type, and Message." 
    });
  }

  const sql = "INSERT INTO appointment_form (name, email, mobile, case_type, message, created_at) VALUES (?, ?, ?, ?, ?, NOW())";
  db.query(sql, [name.trim(), email.trim(), mobile.trim(), case_type.trim(), message.trim()], (err, result) => {
    if (err) {
      console.error("Error saving appointment:", err);
      return res.status(500).json({ error: err.sqlMessage || "Failed to save appointment" });
    }

    res.status(201).json({
      success: true,
      message: "Appointment Added Successfully",
      appointmentId: result.insertId,
    });
  });
};

router.post("/appointment_form", handleAddAppointment);
router.post("/appointment_form/add", handleAddAppointment);

// ✅ DELETE appointment by ID
router.delete("/appointment_form/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM appointment_form WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.sqlMessage || err });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({ success: true, message: "Appointment Deleted Successfully" });
  });
});
const Razorpay = require("razorpay");
const crypto = require("crypto");

const RAZORPAY_KEY_ID = "rzp_test_Tn1uOl0whFlr0q";
const RAZORPAY_KEY_SECRET = "lEiKBKMDbiT1fp4XwcGAjcps";

// Razorpay instance
const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

// ✅ Create Razorpay Order
router.post("/orders", async (req, res) => {
  try {
    const rawAmount = Number(req.body.amount) || 5000;
    // Razorpay amount in paise (1 INR = 100 paise; ₹5,000 = 500,000 paise)
    const amountInPaise = rawAmount < 50000 ? Math.round(rawAmount * 100) : Math.round(rawAmount);

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: "rcpt_" + Math.floor(100000 + Math.random() * 900000),
    };
    const order = await razorpay.orders.create(options);

    db.query(
      "INSERT INTO orders (razorpay_order_id, amount, currency, status, receipt) VALUES (?,?,?,?,?)",
      [order.id, Math.round(order.amount / 100), order.currency, order.status, order.receipt],
      (dbErr) => {
        if (dbErr) console.warn("Orders table insert warning:", dbErr);
      }
    );

    res.json({ order, key_id: RAZORPAY_KEY_ID });
  } catch (err) {
    console.error("Razorpay order creation error:", err);
    res.status(500).json({ error: "Order creation failed", details: err.message || err });
  }
});

// ✅ Verify Razorpay Payment Signature
router.post("/verify_payment", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing payment verification parameters" });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      db.query(
        "UPDATE orders SET status = 'paid', payment_id = ? WHERE razorpay_order_id = ?",
        [razorpay_payment_id, razorpay_order_id],
        (err) => {
          if (err) console.warn("Could not update orders table:", err);
        }
      );
      return res.json({ success: true, message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }
  } catch (err) {
    console.error("Payment verification error:", err);
    res.status(500).json({ success: false, error: "Payment verification failed" });
  }
});


// ✅ Save Consultation Booking after Payment
router.post("/consultation_bookings", (req, res) => {
  const {
    booking_token,
    name,
    mobile,
    email,
    case_type,
    consultation_date,
    time_slot,
    slot_period,
    duration,
    fee,
    payment_mode,
    upi_ref,
    payment_status,
    message,
    booking_status,
  } = req.body;

  const sql = `
    INSERT INTO consultation_bookings 
    (booking_token, name, mobile, email, case_type, consultation_date, time_slot, slot_period, duration, fee, payment_mode, upi_ref, payment_status, message, booking_status) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      booking_token,
      name,
      mobile,
      email,
      case_type,
      consultation_date,
      time_slot,
      slot_period,
      duration,
      fee,
      payment_mode,
      upi_ref,
      payment_status,
      message,
      booking_status,
    ],
    (err, result) => {
      if (err) {
        console.error("Error inserting booking:", err);
        return res.status(500).json({ message: "Error saving booking", error: err.sqlMessage || err });
      }
      res.json({ message: "Consultation booked successfully!", id: result.insertId });
    }
  );
});

// ✅ GET all Consultation Bookings
router.get("/consultation_bookings", (req, res) => {
  db.query("SELECT * FROM consultation_bookings ORDER BY id DESC", (err, rows) => {
    if (err) {
      console.error("Error fetching consultation bookings:", err);
      return res.status(500).json({ error: err.sqlMessage || err });
    }
    res.json(rows);
  });
});

// ✅ UPDATE Consultation Booking Status
router.put("/consultation_bookings/:id", (req, res) => {
  const { id } = req.params;
  const { booking_status, payment_status } = req.body;
  const updates = [];
  const params = [];

  if (booking_status) {
    updates.push("booking_status = ?");
    params.push(booking_status);
  }
  if (payment_status) {
    updates.push("payment_status = ?");
    params.push(payment_status);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: "No fields provided to update" });
  }

  params.push(id);
  const sql = `UPDATE consultation_bookings SET ${updates.join(", ")} WHERE id = ?`;
  db.query(sql, params, (err, result) => {
    if (err) {
      console.error("Error updating consultation booking:", err);
      return res.status(500).json({ error: err.sqlMessage || err });
    }
    res.json({ success: true, message: "Consultation booking updated successfully" });
  });
});

// ✅ DELETE Consultation Booking
router.delete("/consultation_bookings/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM consultation_bookings WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("Error deleting consultation booking:", err);
      return res.status(500).json({ error: err.sqlMessage || err });
    }
    res.json({ success: true, message: "Consultation booking deleted successfully" });
  });
});


// ✅ GET DASHBOARD STATS (Team members, cases, categories, appointments & consultation bookings)
router.get("/dashboard/stats", (req, res) => {
  const qTeam = "SELECT COUNT(*) AS total FROM team_members";
  const qCategories = "SELECT * FROM category";
  const qCaseOrders = "SELECT * FROM case_orders";
  const qAppointments = "SELECT * FROM appointment_form";
  const qConsultations = "SELECT * FROM consultation_bookings ORDER BY id DESC";

  db.query(qTeam, (err1, teamRes) => {
    const teamCount = (!err1 && teamRes && teamRes[0]) ? teamRes[0].total : 0;

    db.query(qCategories, (err2, categoryRows) => {
      const categories = (!err2 && Array.isArray(categoryRows)) ? categoryRows : [];

      db.query(qCaseOrders, (err3, caseOrderRows) => {
        const caseOrders = (!err3 && Array.isArray(caseOrderRows)) ? caseOrderRows : [];

        db.query(qAppointments, (err4, appointmentRows) => {
          const appointments = (!err4 && Array.isArray(appointmentRows)) ? appointmentRows : [];

          db.query(qConsultations, (err5, consultRows) => {
            const consultations = (!err5 && Array.isArray(consultRows)) ? consultRows : [];

            // Compute total revenue from consultations
            const totalRevenue = consultations.reduce((acc, curr) => {
              const val = parseFloat(curr.fee) || 0;
              return acc + val;
            }, 0);

            // Compute category wise breakdown
            const categoryWise = categories.map(cat => {
              const catName = (cat.category_name || "").toLowerCase();
              const matchingOrders = caseOrders.filter(co =>
                (co.case_title && co.case_title.toLowerCase().includes(catName)) ||
                (co.description && co.description.toLowerCase().includes(catName))
              );
              const matchingAppointments = appointments.filter(apt =>
                (apt.case_type && apt.case_type.toLowerCase().includes(catName))
              );
              const matchingConsultations = consultations.filter(cb =>
                (cb.case_type && cb.case_type.toLowerCase().includes(catName))
              );

              return {
                category_id: cat.category_id,
                category_name: cat.category_name,
                description: cat.description,
                image_url: cat.image_url,
                parent_id: cat.parent_id,
                cases_count: matchingOrders.length,
                appointments_count: matchingAppointments.length,
                consultations_count: matchingConsultations.length,
                total_count: matchingOrders.length + matchingAppointments.length + matchingConsultations.length
              };
            });

            res.json({
              team_members_count: teamCount,
              categories_count: categories.length,
              case_orders_count: caseOrders.length,
              total_cases_count: categories.length + caseOrders.length,
              appointments_count: appointments.length,
              consultations_count: consultations.length,
              consultations_revenue: totalRevenue,
              categories: categoryWise,
              recent_orders: caseOrders.slice(0, 5),
              recent_appointments: appointments.slice(0, 5),
              recent_consultations: consultations.slice(0, 5)
            });
          });
        });
      });
    });
  });
});

module.exports = router;

