
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register({ loadData }) {
  const [register, setregister] = useState({
    Sname: "",
    Phone: "",
    Email: "",
    Cases: "",
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

    axios
      .post("http://localhost:5000/sarbit/registration/add", register)
      .then((res) => {
        setLoading(false);
        const successText = res.data?.message || "Registration Successful!";
        setAlertInfo({
          type: "success",
          message: `${successText} Redirecting to login...`
        });
        alert(successText);

        handleClear();

        if (loadData) {
          loadData();
        }

        setTimeout(() => {
          navigate("/Userform");
        }, 1500);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Registration error:", error);

        let errorMessage = "Error submitting registration form.";
        if (error.response && error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.message === "Network Error" || error.code === "ERR_NETWORK") {
          errorMessage = "Cannot connect to server. Please ensure the backend server is running on port 5000.";
        }

        setAlertInfo({
          type: "danger",
          message: errorMessage
        });
        alert(errorMessage);
      });
  };

  const handleClear = () => {
    setregister({
      Sname: "",
      Phone: "",
      Email: "",
      Cases: "",
      Uname: "",
      Password: ""
    });
    setAlertInfo({ type: "", message: "" });
  };

  return (
    <>
      <div className="regis">
        <br />
        <h2>Welcome To Client Registration Form</h2>
        <br />

        {alertInfo.message && (
          <div className="container" style={{ maxWidth: "600px" }}>
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
            <table className="Registeration">
              <tbody>
                <tr>
                  <td className="blank"></td>
                  <td>Client Name :</td>
                  <td>
                    <input
                      type="text"
                      className="inputfield form-control mb-3"
                      id="Sname"
                      name="Sname"
                      placeholder="Client Name"
                      value={register.Sname}
                      onChange={handleChange}
                      required
                    />
                  </td>
                </tr>
                <tr>
                  <td className="blank"></td>
                  <td>Phone :</td>
                  <td>
                    <input
                      type="tel"
                      className="inputfield form-control mb-3"
                      id="Phone"
                      name="Phone"
                      placeholder="Phone No (e.g. 9876543210)"
                      value={register.Phone}
                      maxLength={15}
                      onChange={handleChange}
                      required
                    />
                  </td>
                </tr>
                <tr>
                  <td className="blank"></td>
                  <td>Email :</td>
                  <td>
                    <input
                      type="email"
                      className="inputfield form-control mb-3"
                      id="Email"
                      name="Email"
                      placeholder="Email"
                      value={register.Email}
                      onChange={handleChange}
                      required
                    />
                  </td>
                </tr>
                <tr>
                  <td className="blank"></td>
                  <td>Cases Name :</td>
                  <td>
                    <input
                      type="text"
                      className="inputfield form-control mb-3"
                      id="Cases"
                      name="Cases"
                      value={register.Cases}
                      onChange={handleChange}
                      placeholder="Cases"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="blank"></td>
                  <td>User Name :</td>
                  <td>
                    <input
                      type="text"
                      className="inputfield form-control mb-3"
                      id="Uname"
                      name="Uname"
                      value={register.Uname}
                      onChange={handleChange}
                      placeholder="Username"
                      required
                    />
                  </td>
                </tr>
                <tr>
                  <td className="blank"></td>
                  <td>Password :</td>
                  <td>
                    <input
                      type="password"
                      className="inputfield form-control mb-3"
                      id="Password"
                      name="Password"
                      value={register.Password}
                      onChange={handleChange}
                      placeholder="Password"
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
                      className="Submit btn btn-success mr-4 mb-3"
                      disabled={loading}
                    >
                      {loading ? "Submitting..." : "Submit"}
                    </button>
                    <button
                      type="button"
                      className="Submit btn btn-secondary mb-3"
                      onClick={handleClear}
                      disabled={loading}
                    >
                      Clear
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="blank"></td>
                  <td></td>
                  <td>
                    <p className="mt-2 text-muted">
                      Already registered?{" "}
                      <Link to="/Userform" className="font-weight-bold">
                        Login here
                      </Link>
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </center>
        </form>
        <br />
        <br />
      </div>
    </>
  );
}

export default Register;