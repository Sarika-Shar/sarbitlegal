import React, { useState } from "react";
import axios from "axios";


function Contactus() {
const [formData, setFormData] = useState({
	name: "",
	email: "",
	mobile: "",
	case_type: "",
	message: ""
  });
 

// form handlers
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/sarbit/appointment_form", formData);
      alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert("Error saving appointment");
    }
  };

    return(
        <>
        
    <section className="hero-wrap hero-wrap-2" style={{ backgroundImage: "url('src/assets/bg_2.jpg')", backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat" }} >
      <div className="overlay"></div>
      <div className="container">
        <div className="row no-gutters slider-text align-items-end justify-content-center">
          <div className="col-md-9 ftco-animate mb-5 text-center">
          	<p className="breadcrumbs mb-0"><span className="mr-2"><a href="/">Home <i className="fa fa-chevron-right"></i></a></span>Contact <span><i className="fa fa-chevron-right"></i></span></p>
            <h1 className="mb-0 bread">Contact Us</h1>
          </div>
        </div>
      </div>
    </section>

    <section className="ftco-section bg-light">
			<div className="container">
				<div className="row justify-content-center">
					<div className="col-md-12">
						<div className="wrapper px-md-4">
							<div className="row mb-5">
								{/* <div className="col-md-3">
									<div className="dbox w-100 text-center">
				        		<div className="icon d-flex align-items-center justify-content-center">
				        			<span className="fa fa-map-marker"></span>
				        		</div>
				        		<div className="text">
					            <p><b>Address:</b> <br/>Chamber No -319 0r 1052, RDC, Rajnagar, Ghaziabad, (U.P)</p>
					          </div>
				          </div>
								</div> */}
								<div className="col-md-4">
									<div className="dbox w-100 text-center">
				        		<div className="icon d-flex align-items-center justify-content-center">
				        			<span className="fa fa-phone"></span>
				        		</div>
				        		<div className="text">
					            <p><b>Phone:</b> <br/><a href="tel:09458551953"> 09458551953</a></p>
					          </div>
				          </div>
								</div>
								<div className="col-md-4">
									<div className="dbox w-100 text-center">
				        		<div className="icon d-flex align-items-center justify-content-center">
				        			<span className="fa fa-paper-plane"></span>
				        		</div>
				        		<div className="text">
					            <p><b>Email:</b><br/> <a href="mailto:ad.bksharma319@gmail.com">ad.bksharma319@gmail.com</a></p>
					          </div>
				          </div>
								</div>
								<div className="col-md-4">
									<div className="dbox w-100 text-center">
				        		<div className="icon d-flex align-items-center justify-content-center">
				        			<span className="fa fa-globe"></span>
				        		</div>
				        		<div className="text">
					            <p><b>Website</b><br/> <a href="#">sarbitlegal.com</a></p>
					          </div>
				          </div>
								</div>
							</div>
							<div className="row mb-5">
								<div className="col-md-6">
									<div className="dbox w-100 text-center">
				        		<div className="icon d-flex align-items-center justify-content-center">
				        			<span className="fa fa-map-marker"></span>
				        		</div>
				        		<div className="text">
					            <p><b>Our Office:</b> <br/>Street No -03, Santpura, Govindpuri,<br/>Modinagar, Ghaziabad, (U.P)</p>
					          </div>
				          </div>
								</div>
									<div className="col-md-6">
									<div className="dbox w-100 text-center">
				        		<div className="icon d-flex align-items-center justify-content-center">
				        			<span className="fa fa-map-marker"></span>
				        		</div>
				        		<div className="text">
					            <p><b>Address:</b> <br/>Chamber No -319 0r 1052, RDC, <br/>Rajnagar, Ghaziabad, (U.P)</p>
					          </div>
				          </div>
								</div>
							</div>


							<div className="row no-gutters">
								<div className="col-md-7">
									<div className="contact-wrap w-100 p-md-5 p-4">
										<h3 className="mb-4">Contact Us</h3>
										<form className="appointment_form" onSubmit={handleSubmit}>
    					<div className="row">
								<div className="col-md-6">
									<div className="form-group">
			              <input type="text" name="name" id="name" className="form-control" placeholder="Your Name" value={formData.name} onChange={handleChange}/ >
			            </div>
								</div>
								<div className="col-md-6">
									<div className="form-group">
			              <input type="text" className="form-control" placeholder="Email" name="email" id="email" value={formData.email} onChange={handleChange}  />
			            </div>
								</div>
								<div className="col-md-12">
									<div className="form-group">
			              <input type="number" className="form-control" placeholder="Mobile" name="mobile" id="mobile" value={formData.mobile} onChange={handleChange} />
			            </div>
								</div>
								<div className="col-md-12">
									<div className="form-group">
			    					<div className="form-field">
	          					<div className="select-wrap">
	                      
	                      <select id="case_type" className="form-control" name="case_type" value={formData.case_type} onChange={handleChange}>
	                      	<option value="">Cases Related To</option>
	                        <option value="Business Law">Business Law</option>
	                        <option value="Criminal Law">Criminal Law</option>
	                        <option value="Family Law">Family Law</option>
	                        <option value="Judicial Law">Judicial Law</option>
	                        <option value="Personal Injury">Personal Injury</option>
	                        <option value="Real Estate Law">Real Estate Law</option>
	                      </select>
	                    </div>
			              </div>
			    				</div>
								</div>
								<div className="col-md-12">
									<div className="form-group">
			              <textarea name="message" id="message" cols="30" rows="7" className="form-control" placeholder="Message" value={formData.message} onChange={handleChange}></textarea>
			            </div>
								</div>
								<div className="col-md-12">
									<div className="form-group">
			              <button type="submit" className="btn btn-primary py-3 px-4" >Submit</button>
			            </div>
								</div>
    					</div>
	          </form>
									</div>
								</div>
								<div className="col-md-5 order-md-first d-flex align-items-stretch">
									<div id="map" className="map">
                                        <div style={{ width: "100%", height: "700px" }}>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3500.560295813146!2d77.44164757351119!3d28.672881628435842!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cf12dea54a923%3A0xe3158f7af605a489!2sRaj%20Nagar%20District%20Court!5e0!3m2!1sen!2sin!4v1790690332143!5m2!1sen!2sin"
        title="My Iframe"
        width="100%"
        height="100%"
        style={{ border: "none" }}
      ></iframe>
    </div>
                                       
                                    </div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
        </>
    )
}

export default Contactus;