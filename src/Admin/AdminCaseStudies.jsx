import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Sidebar from "../Components/Sidebar";

const AdminCaseStudies = () => {
  const [categories, setCategories] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    category_name: "",
    parent_id: "",
    description: "",
  });

  // Fetch categories
  const fetchCategories = () => {
    axios
      .get("http://localhost:5000/sarbit/category")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setCategories(res.data);
        }
      })
      .catch((err) => console.error("Error fetching categories:", err));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category_name.trim()) {
      alert("Please enter Category Name");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("category_name", form.category_name.trim());
      formData.append("description", form.description.trim());
      if (form.parent_id && !isNaN(form.parent_id)) {
        formData.append("parent_id", form.parent_id);
      }
      if (file) {
        formData.append("image", file);
      }

      await axios.post("http://localhost:5000/sarbit/category", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("Cases Category added successfully!");
      setForm({ category_name: "", parent_id: "", description: "" });
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchCategories();
    } catch (err) {
      console.error("Error adding category:", err);
      const errMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to add category. Please check backend server.";
      alert(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await axios.delete(`http://localhost:5000/sarbit/category/${id}`);
      alert("Category Deleted!");
      fetchCategories();
    } catch (err) {
      console.error("Error deleting category:", err);
      alert("Failed to delete category");
    }
  };

  return (
    <div className="container-fluid my-4">
      <div className="row">
        <div className="col-lg-3 col-md-4 mb-4">
          <Sidebar />

          <div className="card shadow-sm mt-3 p-3">
            <h5 className="font-weight-bold mb-3">Add Case Category</h5>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="form-group mb-2">
                <label className="font-weight-bold">Category Name *</label>
                <input
                  type="text"
                  className="form-control"
                  name="category_name"
                  value={form.category_name}
                  onChange={handleChange}
                  placeholder="e.g. Criminal Law / Civil"
                  required
                />
              </div>

              <div className="form-group mb-2">
                <label className="font-weight-bold">Parent Category ID (optional)</label>
                <input
                  type="number"
                  className="form-control"
                  name="parent_id"
                  value={form.parent_id}
                  onChange={handleChange}
                  placeholder="Parent ID (leave empty if main)"
                />
              </div>

              <div className="form-group mb-2">
                <label className="font-weight-bold">Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Category description"
                  rows="2"
                />
              </div>

              <div className="form-group mb-3">
                <label className="font-weight-bold">Category Image</label>
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
                {loading ? "Adding..." : "Add Category"}
              </button>
            </form>
          </div>
        </div>

        <div className="col-lg-9 col-md-8">
          <div className="card shadow-sm p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="mb-0 font-weight-bold">
                Manage Case Categories ({categories.length})
              </h4>
              <button onClick={fetchCategories} className="btn btn-sm btn-outline-secondary">
                <i className="fa fa-refresh mr-1"></i> Refresh
              </button>
            </div>

            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="thead-dark">
                  <tr>
                    <th>ID</th>
                    <th>Image</th>
                    <th>Category Name</th>
                    <th>Parent ID</th>
                    <th>Description</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center text-muted py-4">
                        No categories found. Use the form on the left to add one.
                      </td>
                    </tr>
                  ) : (
                    categories.map((c) => (
                      <tr key={c.category_id}>
                        <td>{c.category_id}</td>
                        <td className="text-center" style={{ width: "90px" }}>
                          {c.image_url ? (
                            <img
                              src={
                                c.image_url.startsWith("http")
                                  ? c.image_url
                                  : `http://localhost:5000/${c.image_url}`
                              }
                              alt={c.category_name}
                              style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "8px" }}
                            />
                          ) : (
                            <span className="badge badge-light border">No Image</span>
                          )}
                        </td>
                        <td className="font-weight-bold">{c.category_name}</td>
                        <td>{c.parent_id !== null ? c.parent_id : "-"}</td>
                        <td>{c.description || "-"}</td>
                        <td>
                          <button
                            onClick={() => handleDelete(c.category_id)}
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

export default AdminCaseStudies;
