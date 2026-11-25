import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";

function Userform({ loadData }) {
  const [register, setregister] = useState({
    Uname: "",
    Password: ""
  });
  const [loading, setLoading] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ type: "", message: "" });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setregister({ ...register, [e.target.name]: e.target.value });
    if (alertInfo.message) {
      setAlertInfo({ type: "", message: "" });
    }
  };

  const submitData = (e) => {
    e.preventDefault();
    setLoading(true);
    setAlertInfo({ type: "", message: "" });

    const payload = {
      Uname: register.Uname.trim(),
      Password: register.Password
    };

    axios
      .post(`${API_BASE_URL}/sarbit/login`, payload, { timeout: 10000 })
      .then((res) => {
        setLoading(false);
        const userId = res.data.userId;
        localStorage.setItem("userId", userId);

        setAlertInfo({
          type: "success",
          message: "Login Successful! Redirecting to Dashboard..."
        });

        if (loadData) {
          loadData();
        }

        setTimeout(() => {
          navigate("/AdminDashboard");
        }, 800);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Login error:", error);

        let errorMessage = "Invalid username or password.";
        if (error.response && error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
          errorMessage = "Request timed out. Please check if the backend server is running.";
        } else if (error.message === "Network Error" || error.code === "ERR_NETWORK") {
          errorMessage = "Cannot connect to server. Please verify the backend is running on port 5000.";
        }

        setAlertInfo({
          type: "danger",
          message: errorMessage
        });
      });
  };

  return (
    <>
      <div className="Login mt-5">
        <h2>Welcome To Our Login Page</h2>
        <br />

        {alertInfo.message && (
          <div className="container" style={{ maxWidth: "500px" }}>
            <div
              className={`alert alert-${alertInfo.type} alert-dismissible fade show text-center`}
              role="alert"
            >
              {alertInfo.message}
            </div>
          </div>
        )}

        <form onSubmit={submitData}>
          <center>
            <table className="Registration">
              <tbody>
                <tr>
                  <td className="blank"></td>
                  <td>User Name :</td>
                  <td>
                    <input
                      type="text"
                      className="inputfield form-control mb-3"
                      name="Uname"
                      id="Uname"
                      placeholder="Username"
                      onChange={handleChange}
                      value={register.Uname}
                      required
                    />
                  </td>
                </tr>
                <tr>
                  <td className="blank"></td>
                  <td> Password :</td>
                  <td>
                    <input
                      type="password"
                      className="inputfield form-control mb-3"
                      name="Password"
                      id="Password"
                      placeholder="Password"
                      onChange={handleChange}
                      value={register.Password}
                      required
                    />
                  </td>
                </tr>
                <tr>
                  <td className="blank"></td>
                  <td></td>
                  <td>
                    <button
                      type="submit"
                      className="Submit btn btn-success mr-3 mb-5"
                      disabled={loading}
                    >
                      {loading ? "Logging in..." : "Submit"}
                    </button>
                    <Link to="/register" className="Submit btn btn-primary mb-5">
                      Register
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </center>
        </form>
      </div>
    </>
  );
}

export default Userform;
