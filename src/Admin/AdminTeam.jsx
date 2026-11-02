import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../Components/Sidebar";
import axios from "axios";
import { API_BASE_URL, getImageUrl } from "../config";

const AdminTeam = () => {
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({ name: "", role: "", description: "" });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const fetchMembers = () => {
    axios
      .get(`${API_BASE_URL}/sarbit/team_members`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setMembers(res.data);
        }
      })
      .catch((err) => console.error("Error fetching team members:", err));
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert("Please enter member name");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("role", form.role.trim());
      formData.append("description", form.description.trim());
      if (file) {
        formData.append("image", file);
      }

      await axios.post(`${API_BASE_URL}/sarbit/team_members`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("Team Member added successfully!");
      setForm({ name: "", role: "", description: "" });
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchMembers();
    } catch (err) {
      console.error("Error adding team member:", err);
      const errMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to add team member. Please check backend server.";
      alert(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this team member?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/sarbit/team_members/${id}`);
      alert("Member Deleted!");
      fetchMembers();
    } catch (err) {
      console.error(err);
      alert("Failed to delete member");
    }
  };

  return (
    <div className="container-fluid my-4">
      <div className="row">
        <div className="col-lg-3 col-md-4 mb-4">
          <Sidebar />

          <div className="card shadow-sm mt-3 p-3">
            <h5 className="font-weight-bold mb-3">Add Team Member</h5>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="form-group mb-2">
                <label className="font-weight-bold">Name *</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  required
                />
              </div>

              <div className="form-group mb-2">
                <label className="font-weight-bold">Role / Designation</label>
                <input
                  type="text"
                  className="form-control"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  placeholder="e.g. Senior Advocate / Legal Advisor"
                />
              </div>

              <div className="form-group mb-2">
                <label className="font-weight-bold">Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Short bio or expertise"
                  rows="2"
                />
              </div>

              <div className="form-group mb-3">
                <label className="font-weight-bold">Profile Image</label>
                <input
                  type="file"
                  className="form-control-file"
                  name="image"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </div>

              <button
                type="submit"
                className="btn btn-success btn-block"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Member"}
              </button>
            </form>
          </div>
        </div>

        <div className="col-lg-9 col-md-8">
          <div className="card shadow-sm p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="mb-0 font-weight-bold">Manage Team Members ({members.length})</h4>
              <button onClick={fetchMembers} className="btn btn-sm btn-outline-secondary">
                <i className="fa fa-refresh mr-1"></i> Refresh
              </button>
            </div>

            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="thead-dark">
                  <tr>
                    <th>ID</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Description</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {members.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center text-muted py-4">
                        No team members added yet. Use the form on the left to add.
                      </td>
                    </tr>
                  ) : (
                    members.map((m) => (
                      <tr key={m.id}>
                        <td>{m.id}</td>
                        <td className="text-center" style={{ width: "90px" }}>
                          {m.image_url ? (
                            <img
                              src={
                                m.image_url.startsWith("http")
                                  ? m.image_url
                                  : getImageUrl(m.image_url)
                              }
                              alt={m.name}
                              style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "50%" }}
                            />
                          ) : (
                            <span className="badge badge-secondary">No Image</span>
                          )}
                        </td>
                        <td className="font-weight-bold">{m.name}</td>
                        <td>{m.role || "-"}</td>
                        <td>{m.description || "-"}</td>
                        <td>
                          <button
                            onClick={() => handleDelete(m.id)}
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

export default AdminTeam;
