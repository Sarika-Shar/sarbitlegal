import React from "react";
import {BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Sidebar from "../Components/Sidebar";
import Menu from "../Components/Menu";
import Home from "../Home";
import CaseOrder from "../CaseOrder";
import About from "../About";
import OurTeam from "../OurTeam";
import ConsultationBooking from "../Components/ConsultationBooking";
import Contactus from "../Contactus";
import AdminDashboard from "../Admin/AdminDashboard";
import AdminCaseStudies from "../Admin/AdminCaseStudies";
import AdminTeam from "../Admin/AdminTeam";
import AdminAppointments from "../Admin/AdminAppointments";
import AdminOrders from "../Admin/AdminOrders";
import AdminConsultations from "../Admin/AdminConsultations";
import Register from "../Admin/Register";
import Edit from "../Admin/UpdateRegister";
import '../style.css';
import Userform from "../Admin/Userform";


function Routing()
{
    return(
        <>

        <BrowserRouter>
        <Header />
        <Menu />
        
        <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/About" element={<About />}></Route>
            <Route path="/Sidebar" element={<Sidebar />}></Route>
            <Route path="/Contactus" element={<Contactus />}></Route>
            <Route path="/ConsultationBooking" element={<ConsultationBooking />}></Route>
            <Route path="/CaseOrder" element={<CaseOrder />}></Route>
            <Route path="/AdminDashboard" element={<AdminDashboard />}></Route>
            <Route path="/AdminTeam" element={<AdminTeam />} ></Route>
            <Route path="/OurTeam" element={<OurTeam />} ></Route>
            <Route path="/Register" element={<Register />} ></Route>
            <Route path="/register" element={<Register />} ></Route>
            <Route path="/Userform" element={<Userform />} ></Route>
            <Route path="/AdminCaseStudies" element={<AdminCaseStudies />} ></Route>
            <Route path="/edit/:id" element={<Edit />} ></Route>
            <Route path="/AdminAppointments" element={<AdminAppointments />} ></Route>
            <Route path="/AdminOrders" element={<AdminOrders />} ></Route>
            <Route path="/AdminConsultations" element={<AdminConsultations />} ></Route>

            </Routes>
            <Footer />
            </BrowserRouter>
        </>
    )
}

export default Routing;