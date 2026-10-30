import { Link } from "react-router-dom";
import React from "react";
import '../style.css';
import '../css/animate.css';
import '../css/flaticon.css';
import logo from '../assets/logo.png'

function Header(){
	
    return(
        <>
          	<div className="wrap">
			<div className="container">
				<div className="row">
					<div className="col-md-6 d-flex align-items-center">
						<p className="mb-0 phone pl-md-2">
							<a href="tel:9458551953" className="mr-2"><span className="fa fa-phone mr-1"></span> 9458551953</a> 
							<a href="mailto:ad.bksharma319@gmail.com"><span className="fa fa-paper-plane mr-1"></span> ad.bksharma319@gmail.com</a>
						</p>
					</div>
					<div className="col-md-6 d-flex justify-content-md-end">
						<div className="social-media">
			    		<p className="mb-0 d-flex">
			    			<a href="https://www.facebook.com/" className="d-flex align-items-center justify-content-center" target="_blank"><span className="fa fa-facebook"><i className="sr-only">Facebook</i></span></a>
			    			<a href="https://in.linkedin.com/" className="d-flex align-items-center justify-content-center" target="_blank"><span className="fa fa-twitter"><i className="sr-only">Linkedin</i></span></a>
			    			<a href="https://www.instagram.com/" className="d-flex align-items-center justify-content-center" target="_blank"><span className="fa fa-instagram"><i className="sr-only">Instagram</i></span></a>
			    			<a href="https://wa.me/9458551953" className="d-flex align-items-center justify-content-center" target="_blank"><span className="fa fa-whatsapp"><i className="sr-only">Whatsapp</i></span></a>
			    		</p>
		        </div>
					</div>
				</div>
			</div>
		</div>
    
	  <nav className="navbar navbar-expand-lg navbar-dark ftco_navbar bg-dark ftco-navbar-light" id="ftco-navbar" style={{ position: "sticky", top: 0, zIndex: 1000 }}>
	    <div className="container">
	      <Link className="navbar-brand" to="/"><img src={ logo } className="img-fluid" width="100px"/></Link>
	      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#ftco-nav" aria-controls="ftco-nav" aria-expanded="false" aria-label="Toggle navigation">
	        <span className="oi oi-menu"></span> Menu
	      </button>

	      <div className="collapse navbar-collapse" id="ftco-nav">
	        <ul className="navbar-nav ml-auto">
	          <li className="nav-item active"><Link to="/" className="nav-link">Home</Link></li>
			   <li className="nav-item active"><Link to="/About" className="nav-link">About Us</Link></li>
			  <li className="nav-item active"><Link to="/ConsultationBooking" className="nav-link">Consultation</Link></li> 
			  <li className="nav-item active"><Link to="/OurTeam" className="nav-link">OurTeam</Link></li> 
			  	  <li className="nav-item active"><Link to="/CaseOrder" className="nav-link">Case Orders</Link></li> 
		
			  <li className="nav-item active"><Link to="/Contactus" className="nav-link">Contact Us</Link></li>
			  	  <li className="nav-item active"><Link to="/Userform" className="nav-link">Login</Link></li>
			  {/* <li className="nav-item active"><Link to="/AdminDashboard" className="nav-link">Admin</Link></li>  */}

            </ul>
	      </div>
	    </div>
	  </nav>
        </>
    )
}

export default Header;