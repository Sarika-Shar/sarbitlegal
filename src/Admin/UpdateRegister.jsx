import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function Edit() 
{
  const { userid } = useParams();
  const navigate = useNavigate();
 const userId = localStorage.getItem("userId"); 
  const [register, setRegister] = useState(
    {
    Sname: "",
    Phone: "",
    Email: "",
    Cases: "",
    Uname: "",
    Password: ""

  });

  // ✅ FETCH USER DATA
  useEffect(() => {
    axios.get(`http://localhost:5000/sarbit/registration/${userId}`)
    .then((res) => {
      const user = Array.isArray(res.data) ? res.data[0] : res.data;
      if (user) {
        setRegister({
          Sname: user.Sname || "",
          Phone: user.Phone || "",
          Email: user.Email || "",
          Cases: user.Cases || "",
          Uname: user.Uname || "",
          Password: user.Password || ""
        });
      }
    })
    .catch((err) => console.log(err));
}, [userid]);

  // ✅ HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setRegister({
      ...register,
      [e.target.name]: e.target.value
    });
  };

  // ✅ UPDATE DATA
const submitData = (e) => {
  e.preventDefault();
  axios.put(`http://localhost:5000/sarbit/registration/edit/${userId}`, register)
    .then(() => {
      alert("Updated Successfully");
      navigate("/AdminDashboard");
    })
    .catch((err) => {
      console.log(err);
      alert("Error updating data");
    });
};

  return (
    <div className="Registeration">
      <center>
      <h2 className="mt-3 mb-2">Update Form</h2>

      <form onSubmit={submitData} className="w-100 align-item-center">
<table className="Registeration w-40 align-center">
      
        <tbody>
        <tr></tr>
        <tr>
          <td>
        <input
          type="text"
          name="Sname"
          className="inputfield form-control mb-3"
          placeholder="Student Name"
          value={register.Sname}
          onChange={handleChange}
        />
        </td></tr>  <tr></tr>
                <tr>
          <td>
        <input
          type="number"
          name="Phone"
          className="inputfield form-control mb-3"
          placeholder="Phone"
          value={register.Phone}
          onChange={handleChange}
        />
        </td>
        </tr>  <tr></tr>
        <tr>
          <td>
        <input
          type="text"
          name="Email"
          className="inputfield form-control mb-3"
          placeholder="Email"
          value={register.Email}
          onChange={handleChange}
        />
        </td>
        </tr>  <tr></tr>
        <tr>
          <td>
        <input
          type="text"
          name="Cases"
          className="inputfield form-control mb-3"
          placeholder="Cases"
          value={register.Cases}
          onChange={handleChange}
        />
        </td>
        </tr>  <tr></tr>
      
                 <tr>
          <td>
        <input
          type="text"
          name="Uname"
          className="inputfield form-control mb-3"
          placeholder="User Name"
          value={register.Uname}
          onChange={handleChange}
        />
        </td>
        </tr>  <tr></tr>
        <tr>
          <td>
        <input
          type="text"
          name="Password"
          className="inputfield form-control mb-3"
          placeholder="Password"
          value={register.Password}
          onChange={handleChange}
        />
        </td>
     </tr>
        
<br></br>        

        <button type="submit" className="btn btn-success form-control mb-3">Update</button>
        <br/><br/>
        </tbody>
    </table>

      </form>
      </center>
    </div>
  );
}

export default Edit;