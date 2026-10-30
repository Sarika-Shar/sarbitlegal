import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../Components/Sidebar";

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    case_type: "",
    message: ""
  });

  // Fetch all appointments
  const fetchAppointments = () => {
    axios
      .get("http://localhost:5000/sarbit/appointment_form")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setAppointments(res.data);
        }
      })
      .catch((err) => console.error("Error fetching appointments:", err));
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.mobile || !form.case_type || !form.message) {
      alert("Please fill all required fields: Name, Email, Mobile, Case Type, Message");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/sarbit/appointment_form", form);
      alert(res.data?.message || "Appointment Added Successfully!");
      setForm({ name: "", email: "", mobile: "", case_type: "", message: "" });
      fetchAppointments();
    } catch (err) {
      console.error("Error adding appointment:", err);
      const errMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to add appointment. Please check backend server.";
      alert(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Delete appointment
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;
    try {
      await axios.delete(`http://localhost:5000/sarbit/appointment_form/${id}`);
      alert("Appointment Deleted!");
      fetchAppointments();
    } catch (err) {
      console.error(err);
      alert("Failed to delete appointment");
    }
  };

  return (
    <div className="container-fluid my-4">
      <div className="row">
        <div className="col-lg-3 col-md-4 mb-4">
          <Sidebar />

          <div className="card shadow-sm mt-3 p-3">
            <h5 className="font-weight-bold mb-3">Add New Appointment</h5>
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-2">
                <label className="font-weight-bold">Client Name *</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Client Full Name"
                  required
                />
              </div>

              <div className="form-group mb-2">
                <label className="font-weight-bold">Email *</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="client@example.com"
                  required
                />
              </div>

              <div className="form-group mb-2">
                <label className="font-weight-bold">Mobile No *</label>
                <input
                  type="tel"
                  className="form-control"
                  name="mobile"
                  maxLength={15}
                  value={form.mobile}
                  onChange={handleChange}
                  placeholder="e.g. 9876543210"
                  required
                />
              </div>

              <div className="form-group mb-2">
                <label className="font-weight-bold">Case Type *</label>
                <input
                  type="text"
                  className="form-control"
                  name="case_type"
                  value={form.case_type}
                  onChange={handleChange}
                  placeholder="e.g. Criminal, Family, Civil"
                  required
                />
              </div>

              <div className="form-group mb-3">
                <label className="font-weight-bold">Message / Details *</label>
                <textarea
                  className="form-control"
                  name="message"
                  rows="3"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Appointment description or time preference..."
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-success btn-block"
                disabled={loading}
              >
                {loading ? "Adding..." : "Book Appointment"}
              </button>
            </form>
          </div>
        </div>

        <div className="col-lg-9 col-md-8">
          <div className="card shadow-sm p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="mb-0 font-weight-bold">
                Manage Appointments ({appointments.length})
              </h4>
              <button
                onClick={fetchAppointments}
                className="btn btn-sm btn-outline-secondary"
              >
                <i className="fa fa-refresh mr-1"></i> Refresh
              </button>
            </div>

            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="thead-dark">
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Case Type</th>
                    <th>Message</th>
                    <th>Created At</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center text-muted py-4">
                        No appointments found. Use the form on the left to add one.
                      </td>
                    </tr>
                  ) : (
                    appointments.map((a) => (
                      <tr key={a.id}>
                        <td>{a.id}</td>
                        <td className="font-weight-bold">{a.name}</td>
                        <td>{a.email}</td>
                        <td>{a.mobile}</td>
                        <td>
                          <span className="badge badge-info">{a.case_type}</span>
                        </td>
                        <td>{a.message}</td>
                        <td><small>{a.created_at ? new Date(a.created_at).toLocaleString() : "-"}</small></td>
                        <td>
                          <button
                            onClick={() => handleDelete(a.id)}
                            className="btn btn-sm btn-danger"
                          >
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
      </div>
    </div>
  );
};

export default AdminAppointments;
