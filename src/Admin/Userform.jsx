import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";


function Userform({ loadData }) 
{

  const [register, setregister] = useState({
    Uname: "",
    Password: ""
  });

  const navigate = useNavigate(); 

  const handleChange = (e) => {
    setregister({ ...register, [e.target.name]: e.target.value });
  };

  const submitData = (e) => 
    {
    e.preventDefault();

    axios.post("http://localhost:5000/sarbit/login", register)
      .then((res) => 
        {
        alert("Login Success");

        
        const userId = res.data.userId;

      
        localStorage.setItem("userId",userId);

        
        navigate("/AdminDashboard");

        loadData && loadData();
      })
      .catch((error) => 
        {
        console.error(error);
        alert("Login Failed");
      });
  };

  return (
    <>
     
    <div className="Login mt-5">
        <h2>Welcome To Our Login Page</h2><br></br>
        <form onSubmit={submitData}>
            <center>
            <table className="Registration">
              <tbody>
            <tr>
                <td className="blank"></td>
                <td>Name :</td>
            <td> <input typeof="Text" className="inputfield form-control mb-3" name="Uname" id="Uname" placeholder="Username"
            onChange={handleChange}    value={register.Uname} required></input></td></tr>
          <tr><td className="blank"></td>
          <td> Password :</td>
          <td > <input type="Password" className="inputfield form-control mb-3" name="Password" id="Password" placeholder="Password"
            onChange={handleChange} value={register.Password} required></input></td></tr>
            <tr><td className="blank"></td><td></td>
            <td ><button type="submit" className="Submit btn btn-success mr-3 mb-5" >Submit</button>
             <Link to="/register" className="Submit btn btn-primary mb-5">Register</Link>
            </td></tr>            </tbody></table>
       </center>
        </form>

    </div>
     
    
    </>
    )
}
export default Userform;