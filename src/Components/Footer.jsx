import React from "react";
import { Link } from "react-router-dom";
import logo from '../assets/logo.png'


function Footer(){
    return(
        <>

    <footer className="ftco-footer">
      <div className="container">
        <div className="row mb-1">
          <div className="col-sm-12 col-md">
            <div className="ftco-footer-widget mb-4">
              <Link className="navbar-brand" to="/"><img src={ logo } className="img-fluid" width="120px"/></Link>
              <p>Committed To Deliver Strategic & Practical Solutions</p>
              <ul className="ftco-footer-social list-unstyled mt-2">
                <li className="ftco-animate"><Link to="https://wa.me/9458551953" target="_blank"><span className="fa fa-whatsapp"></span></Link></li>
                <li className="ftco-animate"><Link to="https://www.facebook.com/" target="_blank"><span className="fa fa-facebook"></span></Link></li>
                <li className="ftco-animate"><Link to="https://www.instagram.com/" target="_blank"><span className="fa fa-instagram"></span></Link></li>
              </ul>
              
            </div>
          </div>
          <div className="col-sm-12 col-md">
            <div className="ftco-footer-widget mb-4 ml-md-4">
              <h2 className="ftco-heading-2">Explore</h2>
              <ul className="list-unstyled">
                <li><Link to="/about"><span className="fa fa-chevron-right mr-2"></span>About Us</Link></li>
                  <li><Link to="/OurTeam"><span className="fa fa-chevron-right mr-2"></span>Our Team</Link></li>
                <li><Link to="/Contactus"><span className="fa fa-chevron-right mr-2"></span>Contact Us</Link></li>
              
                <li><Link to="/CaseOrder"><span className="fa fa-chevron-right mr-2"></span>Case Orders</Link></li>
              </ul>
            </div>
          </div>
          {/* <div className="col-sm-12 col-md">
            <div className="ftco-footer-widget mb-4 ml-md-4">
              <h2 className="ftco-heading-2">Legal</h2>
              <ul className="list-unstyled">
                <li><Link to=""><span className="fa fa-chevron-right mr-2"></span>Join us</Link></li>
                <li><Link to=""><span className="fa fa-chevron-right mr-2"></span>Blog</Link></li>
                <li><Link to=""><span className="fa fa-chevron-right mr-2"></span>Privacy &amp; Policy</Link></li>
                <li><Link to=""><span className="fa fa-chevron-right mr-2"></span>Term &amp; Conditions</Link></li>
              </ul>
            </div>
          </div> */}
          <div className="col-sm-12 col-md">
             <div className="ftco-footer-widget mb-4">
              <h2 className="ftco-heading-2">Company</h2>
              <ul className="list-unstyled">
                <li><Link to="/Userform"><span className="fa fa-chevron-right mr-2"></span>Login</Link></li>
                <li><Link to="/admin"><span className="fa fa-chevron-right mr-2"></span>Admin</Link></li>
               <li><Link to="/register"><span className="fa fa-chevron-right mr-2"></span>Register</Link></li>
                 <li><Link to="/ConsultationBooking"><span className="fa fa-chevron-right mr-2"></span>Consultation</Link></li>
                
              </ul>
            </div>
          </div>
          <div className="col-sm-12 col-md">
            <div className="ftco-footer-widget mb-4">
            	<h2 className="ftco-heading-2">Have a Questions?</h2>
            	<div className="block-23 mb-3">
	              <ul>
	                <li><span className="icon fa fa-map marker"></span><span className="text">Chamber No - 319 or 1052, Rdc Rajnagar, Ghaziabad.</span></li>
                   <li><Link to="tel:9458551953"><span className="icon fa fa-phone"></span>9458551953<span className="text"></span></Link></li>
	                <li><Link to="mailto:ad.bksharma319@gmail.com"><span className="icon fa fa-paper-plane pr-4"></span><span className="text">ad.bksharma319@gmail.com</span></Link></li>
	              </ul>
	            </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid px-0 py-1 bg-black">
      	<div className="container">
      		<div className="row">
	          <div className="col-md-12">
		
	            <p className="mb-0" style={{color:" rgba(255,255,255,.5)" }}>
	  @Copyright <script>document.write(new Date().getFullYear());</script> All rights reserved | Design & Developed <i className="fa fa-heart color-danger" aria-hidden="true"></i> by <Link to="tel:9650965952" target="_blank">Sarika Sharma</Link>
	  </p>
	          </div>
	        </div>
      	</div>
      </div>
    </footer>
    
        </>
    )
}

export default Footer;