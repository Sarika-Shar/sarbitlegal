import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL, getImageUrl, getPdfUrl } from "../config";
import { Link } from "react-router-dom";
import Sidebar from "../Components/Sidebar";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({
    name: "",
    case_title: "",
    image_url: "",
    pdf_url: "",
    description: ""
  });

  const fetchOrders = () => {
    axios.get(`${API_BASE_URL}/sarbit/case_orders`)
      .then(res => setOrders(res.data))
      .catch(err => console.error("Error fetching orders:", err));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const [fileImage, setFileImage] = useState(null);
  const [filePdf, setFilePdf] = useState(null);
  const [loading, setLoading] = useState(false);
  const imageInputRef = React.useRef(null);
  const pdfInputRef = React.useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.case_title || !filePdf) {
      alert("Please fill Name, Case Title, and upload PDF");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("case_title", form.case_title.trim());
      formData.append("description", form.description.trim());

      if (fileImage) formData.append("image_url", fileImage);
      if (filePdf) formData.append("pdf_url", filePdf);

      await axios.post(`${API_BASE_URL}/sarbit/case_orders`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("Case Order added successfully!");
      setForm({ name: "", case_title: "", description: "" });
      setFileImage(null);
      setFilePdf(null);
      if (imageInputRef.current) imageInputRef.current.value = "";
      if (pdfInputRef.current) pdfInputRef.current.value = "";
      fetchOrders();
    } catch (err) {
      console.error(err);
      const errMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to add Case Order. Please check backend server.";
      alert(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await axios.delete(`${API_BASE_URL}/sarbit/case_orders/${id}`);
        alert("Deleted successfully!");
        fetchOrders();
      } catch (err) {
        console.error(err);
        alert("Failed to delete order");
      }
    }
  };

const handleFileChange = (e) => {
  const { name, files } = e.target;
  if (name === "image_url") setFileImage(files[0]);
  if (name === "pdf_url") setFilePdf(files[0]);
};

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   if (!form.name || !form.case_title || !filePdf) {
//     alert("Please fill Name, Case Title, and upload PDF");
//     return;
//   }

//   try {
//     const formData = new FormData();
//     formData.append("name", form.name);
//     formData.append("case_title", form.case_title);
//     formData.append("description", form.description);
//     if (fileImage) formData.append("image_url", fileImage);
//     if (filePdf) formData.append("pdf_url", filePdf);

//     await axios.post("http://localhost:5000/sarbit/case_orders", formData, {
//       headers: { "Content-Type": "multipart/form-data" }
//     });

//     alert("Case Order added successfully!");
//     setForm({ name: "", case_title: "", image_url: "", pdf_url: "", description: "" });
//     setFileImage(null);
//     setFilePdf(null);
//     fetchOrders();
//   } catch (err) {
//     console.error(err);
//     alert("Failed to add Case Order");
//   }
// };


  return (
    <div className="mt-4 row container-fluid">
      <div className="col-md-2 mb-4">
        <Sidebar/>
      </div>

      <div className="col-md-10 mb-4">
        <h2>Manage Case Orders (PDFs)</h2>
        <p className="text-muted">Add new court orders, client decrees, and PDFs for the homepage slider.</p>

        <form onSubmit={handleSubmit} className="p-4 border rounded bg-light mb-4">
          <div className="form-row">
            <div className="form-group col-md-6">
              <label><strong>Name / Advocate / Court:</strong></label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Adv. Rajesh Sharma / High Court"
                required
              />
            </div>
            <div className="form-group col-md-6">
              <label><strong>Case Title:</strong></label>
              <input
                type="text"
                name="case_title"
                className="form-control"
                value={form.case_title}
                onChange={handleChange}
                placeholder="e.g. State vs. Kapoor Logistics (Bail Order)"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group col-md-6">
              <label><strong>Image (optional):</strong></label>
              <input
                type="file"
                name="image_url"
                ref={imageInputRef}
                className="form-control-file"
                onChange={handleFileChange}
                accept="image/*"
              />
            </div>
            <div className="form-group col-md-6">
              <label><strong>Order PDF File * :</strong></label>
              <input
                type="file"
                name="pdf_url"
                ref={pdfInputRef}
                className="form-control-file"
                onChange={handleFileChange}
                accept="application/pdf"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label><strong>Short Description:</strong></label>
            <textarea
              name="description"
              className="form-control"
              rows="2"
              value={form.description}
              onChange={handleChange}
              placeholder="Brief description of the order or judgment..."
            />
          </div>

          <button type="submit" className="btn btn-success px-4" disabled={loading}>
            <i className="fa fa-plus-circle mr-1"></i> {loading ? "Adding..." : "Add Case Order"}
          </button>
        </form>

        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="thead-dark">
              <tr>
                <th style={{ width: "60px" }}>ID</th>
                <th style={{ width: "80px" }}>Image</th>
                <th>Name</th>
                <th>Case Title</th>
                <th>PDF Link</th>
                <th>Description</th>
                <th style={{ width: "90px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-3">No orders found in database.</td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>
                      {o.image_url ? (
                        <img
                          src={getImageUrl(o.image_url)}
                          alt={o.name}
                          style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px" }}
                        />
                      ) : (
                        <span className="text-muted">No Image</span>
                      )}
                    </td>
                    <td><strong>{o.name}</strong></td>
                    <td>{o.case_title}</td>
                    <td>
                      {o.pdf_url ? (
                        <a
                          href={getPdfUrl(o.pdf_url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-info"
                        >
                          <i className="fa fa-file-pdf-o mr-1"></i> View PDF
                        </a>
                      ) : (
                        <span className="badge badge-light border">No PDF</span>
                      )}
                    </td>
                    <td><small>{o.description || "-"}</small></td>
                    <td>
                      <button onClick={() => handleDelete(o.id)} className="btn btn-sm btn-danger">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
