import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../Components/Sidebar";

const AdminConsultations = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState(null);

  const fetchBookings = () => {
    setLoading(true);
    axios
      .get("http://localhost:5000/sarbit/consultation_bookings")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setBookings(res.data);
        }
      })
      .catch((err) => console.error("Error fetching bookings:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusUpdate = async (id, field, value) => {
    try {
      await axios.put(`http://localhost:5000/sarbit/consultation_bookings/${id}`, {
        [field]: value
      });
      fetchBookings();
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this consultation booking?")) return;
    try {
      await axios.delete(`http://localhost:5000/sarbit/consultation_bookings/${id}`);
      alert("Consultation booking deleted successfully!");
      fetchBookings();
    } catch (err) {
      console.error("Error deleting booking:", err);
      alert("Failed to delete booking");
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus =
      statusFilter === "all" || (b.booking_status || "").toLowerCase() === statusFilter.toLowerCase();

    const q = search.toLowerCase();
    const matchesSearch =
      !search.trim() ||
      (b.name && b.name.toLowerCase().includes(q)) ||
      (b.mobile && b.mobile.toLowerCase().includes(q)) ||
      (b.email && b.email.toLowerCase().includes(q)) ||
      (b.booking_token && b.booking_token.toLowerCase().includes(q)) ||
      (b.case_type && b.case_type.toLowerCase().includes(q));

    return matchesStatus && matchesSearch;
  });

  const totalRevenue = bookings.reduce((sum, b) => {
    return sum + (parseFloat(b.fee) || 0);
  }, 0);

  return (
    <div className="container-fluid my-4">
      <div className="row">
        <div className="col-lg-3 col-md-4 mb-4">
          <Sidebar />

          {/* QUICK SUMMARY CARD */}
          <div className="card shadow-sm mt-3 p-3 text-white" style={{ background: "linear-gradient(135deg, #1d2227 0%, #2c343e 100%)", borderRadius: "12px" }}>
            <h6 className="font-weight-bold mb-3" style={{ color: "#c59b27" }}>
              <i className="fa fa-money mr-2"></i>Consultation Revenue
            </h6>
            <h3 className="font-weight-bold mb-1">₹{totalRevenue.toLocaleString()}</h3>
            <p className="text-light mb-3" style={{ fontSize: "0.85rem", opacity: 0.85 }}>
              Total from {bookings.length} Booked Consultations
            </p>
            <div className="pt-2 border-top border-secondary d-flex justify-content-between" style={{ fontSize: "0.82rem" }}>
              <span>Confirmed:</span>
              <strong>{bookings.filter((b) => b.booking_status === "confirmed").length}</strong>
            </div>
            <div className="pt-1 d-flex justify-content-between" style={{ fontSize: "0.82rem" }}>
              <span>Completed:</span>
              <strong>{bookings.filter((b) => b.booking_status === "completed").length}</strong>
            </div>
          </div>
        </div>

        <div className="col-lg-9 col-md-8">
          <div className="card shadow-sm p-4">
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
              <div>
                <h4 className="mb-0 font-weight-bold">
                  Client Consultation Bookings ({filteredBookings.length})
                </h4>
                <p className="text-muted mb-0" style={{ fontSize: "0.88rem" }}>
                  Paid legal consultations booked via website portal
                </p>
              </div>
              <button onClick={fetchBookings} className="btn btn-sm btn-outline-secondary mt-2 mt-sm-0">
                <i className={`fa fa-refresh mr-1 ${loading ? "fa-spin" : ""}`}></i> Refresh
              </button>
            </div>

            {/* SEARCH AND FILTER BAR */}
            <div className="row mb-3">
              <div className="col-md-7 mb-2">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text bg-white">
                      <i className="fa fa-search text-muted"></i>
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by client name, mobile, email, token, or case type..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {search && (
                    <div className="input-group-append">
                      <button className="btn btn-outline-secondary" onClick={() => setSearch("")}>
                        Clear
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-5 mb-2">
                <div className="d-flex align-items-center">
                  <label className="mr-2 mb-0 font-weight-bold text-nowrap" style={{ fontSize: "0.9rem" }}>
                    Status:
                  </label>
                  <select
                    className="form-control"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Bookings ({bookings.length})</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* TABLE */}
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="thead-dark">
                  <tr>
                    <th>Token</th>
                    <th>Client Details</th>
                    <th>Case Type</th>
                    <th>Date & Time</th>
                    <th>Fee & Mode</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Notes</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="text-center text-muted py-4">
                        {loading ? "Loading bookings..." : "No consultation bookings found."}
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((b) => (
                      <tr key={b.id}>
                        <td>
                          <span className="badge badge-dark p-2" style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>
                            {b.booking_token}
                          </span>
                        </td>
                        <td>
                          <strong className="text-dark d-block">{b.name}</strong>
                          <div className="d-flex align-items-center mt-1">
                            <small className="text-muted mr-2">
                              <i className="fa fa-phone mr-1"></i>
                              <a href={`tel:${b.mobile}`}>{b.mobile}</a>
                            </small>
                            <a
                              href={`https://wa.me/91${b.mobile}?text=${encodeURIComponent(
                                `Namaste ${b.name}, your consultation with Advocate Bittoo Sharma is confirmed for ${
                                  b.consultation_date ? new Date(b.consultation_date).toLocaleDateString() : ""
                                } (${b.time_slot}). Booking Token: ${b.booking_token}. Address: Chamber No. 4, District Court Complex. Helpline: +91 8077767256.`
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="badge badge-success px-2 py-1"
                              title="Send WhatsApp confirmation to client"
                              style={{ textDecoration: "none", fontSize: "0.75rem" }}
                            >
                              <i className="fa fa-whatsapp mr-1"></i> WhatsApp
                            </a>
                          </div>
                          {b.email && (
                            <small className="text-muted d-block">
                              <i className="fa fa-envelope mr-1"></i>
                              <a href={`mailto:${b.email}`}>{b.email}</a>
                            </small>
                          )}
                        </td>
                        <td>
                          <span className="badge badge-info p-1" style={{ fontSize: "0.8rem" }}>
                            {b.case_type}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontSize: "0.88rem" }}>
                            <strong>
                              {b.consultation_date ? new Date(b.consultation_date).toLocaleDateString() : "-"}
                            </strong>
                          </div>
                          <small className="text-muted">
                            <i className="fa fa-clock-o mr-1"></i>
                            {b.time_slot} ({b.slot_period || "2 Hours"})
                          </small>
                        </td>
                        <td>
                          <strong className="text-success d-block">₹{parseFloat(b.fee || 5000).toLocaleString()}</strong>
                          <span className="badge badge-light border text-uppercase" style={{ fontSize: "0.72rem" }}>
                            {b.payment_mode || "UPI"}
                          </span>
                          {b.upi_ref && <small className="d-block text-muted text-truncate" style={{ maxWidth: "90px" }}>Ref: {b.upi_ref}</small>}
                        </td>
                        <td>
                          <select
                            className={`custom-select custom-select-sm font-weight-bold ${
                              b.payment_status === "paid"
                                ? "text-success border-success"
                                : b.payment_status === "verified"
                                ? "text-primary border-primary"
                                : "text-warning border-warning"
                            }`}
                            value={b.payment_status || "paid"}
                            onChange={(e) => handleStatusUpdate(b.id, "payment_status", e.target.value)}
                            style={{ fontSize: "0.8rem", width: "95px" }}
                          >
                            <option value="paid">Paid</option>
                            <option value="verified">Verified</option>
                            <option value="pending">Pending</option>
                          </select>
                        </td>
                        <td>
                          <select
                            className={`custom-select custom-select-sm font-weight-bold ${
                              b.booking_status === "confirmed"
                                ? "text-success border-success"
                                : b.booking_status === "completed"
                                ? "text-primary border-primary"
                                : "text-danger border-danger"
                            }`}
                            value={b.booking_status || "confirmed"}
                            onChange={(e) => handleStatusUpdate(b.id, "booking_status", e.target.value)}
                            style={{ fontSize: "0.8rem", width: "105px" }}
                          >
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="text-center">
                          {b.message ? (
                            <button
                              className="btn btn-sm btn-outline-info"
                              onClick={() => setSelectedMessage({ name: b.name, token: b.booking_token, msg: b.message })}
                              title="View Note"
                            >
                              <i className="fa fa-commenting-o"></i> Note
                            </button>
                          ) : (
                            <span className="text-muted" style={{ fontSize: "0.8rem" }}>-</span>
                          )}
                        </td>
                        <td>
                          <button
                            onClick={() => handleDelete(b.id)}
                            className="btn btn-sm btn-danger"
                            title="Delete booking"
                          >
                            <i className="fa fa-trash"></i>
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
      </div>

      {/* CLIENT NOTE POPUP MODAL */}
      {selectedMessage && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setSelectedMessage(null)}
        >
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title font-weight-bold">
                  Client Message - {selectedMessage.name} ({selectedMessage.token})
                </h5>
                <button type="button" className="close text-white" onClick={() => setSelectedMessage(null)}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p className="lead" style={{ fontSize: "1rem", whiteSpace: "pre-wrap" }}>
                  {selectedMessage.msg}
                </p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedMessage(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminConsultations;
