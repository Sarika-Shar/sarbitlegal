import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import bg1 from './assets/bg_1.jpg';
import axios from "axios";
import about from './assets/about-1.jpg';
import case1 from './assets/case-1.jpg';
import slide1 from './assets/slide1.jpg';
import slide2 from './assets/slide2.jpg';
import slide3 from './assets/slide3.jpg';
import './case-orders.css';
import './bottom-slider.css';
import './team-section.css';
import { API_BASE_URL, getImageUrl, getPdfUrl } from './config';
import { defaultCategories, defaultMembers, defaultOrders } from './data/defaultData';

function Home() {
	
  // categories state
  const [categories, setCategories] = useState(defaultCategories);
  // members state
  const [members, setMembers] = useState(defaultMembers);
  // case orders state
  const [caseOrders, setCaseOrders] = useState(defaultOrders);
  // form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    case_type: "",
    message: ""
  });
  useEffect(() => {
    if (window.Swiper) {
      new window.Swiper(".mySwiper", {
        direction: "horizontal",
        loop: true,
        opacity: 1,
        slidesPerView: 1,
        spaceBetween: 0,
        speed: 500,
        effect: "fade",
        autoplay: {
          delay: 4000,
          disableOnInteraction: false,
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
      });

      new window.Swiper(".bottomHeroSwiper", {
        direction: "horizontal",
        loop: true,
        slidesPerView: 1,
        spaceBetween: 24,
        speed: 700,
        autoplay: {
          delay: 4500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        },
        pagination: {
          el: ".bottom-swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".bottom-swiper-button-next",
          prevEl: ".bottom-swiper-button-prev",
        },
      });
    }
  }, []);
  // fetch categories
  useEffect(() => {
    axios.get(`${API_BASE_URL}/sarbit/category`)
      .then(res => { if (Array.isArray(res.data) && res.data.length > 0) setCategories(res.data); })
      .catch(err => console.warn('Category fetch error, keeping default:', err));
  }, []);

  // fetch team members
  useEffect(() => {
    fetch(`${API_BASE_URL}/sarbit/team_members`)
      .then(res => res.json())
      .then(data => { if (Array.isArray(data) && data.length > 0) setMembers(data); })
      .catch(err => console.warn('Team fetch error, keeping default:', err));
  }, []);

  // fetch case orders (PDF, name, image, case title)
  useEffect(() => {
    axios.get(`${API_BASE_URL}/sarbit/case_orders`)
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setCaseOrders(res.data);
        } else {
          setCaseOrders(defaultOrders);
        }
      })
      .catch(err => {
        console.warn("Could not fetch case orders from DB, using default preview orders:", err);
        setCaseOrders(defaultOrders);
      });
  }, []);

  // init OwlCarousel
  useEffect(() => {
    if ($ && $.fn.owlCarousel) {
      $(".team-slider").owlCarousel({
        loop: true,
        nav: false,
        autoplay: true,
        autoplayTimeout: 5000,
        smartSpeed: 450,
        margin: 20,
        responsive: {
          0: { items: 1 },
          768: { items: 2 },
          991: { items: 3 },
          1200: { items: 3 },
          1920: { items: 3 },
        },
      });
    }
  }, [members]); 
  // important: re-init after members load
   useEffect(() => {
    window.$(".carousel-testimony").owlCarousel({
      loop: true,
      margin: 30,
      nav: true,
      items: 3,
      autoplay: true,
      autoplayTimeout: 4000,
    });
  }, []);

  // form handlers
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/sarbit/appointment_form`, formData);
      alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert("Error saving appointment");
    }
  };
  function Counter({ target, label }) {
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById("section-counter");
      if (section) {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
          setVisible(true);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const end = parseInt(target);
    let duration = 2000;
    let stepTime = 50;
    let step = Math.ceil(end / (duration / stepTime));

    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [visible, target]);

  

  return (
    <div className="col-md-6 col-lg-3 d-flex align-items-stretch counter-wrap ftco-animate">
      <div className="block-18 py-4 w-100 text-center">
        <span className="icon flaticon-checklist"></span>
        <div className="text align-items-center">
          <strong className="number">{count}</strong>
          <span>{label}</span>
        </div>
      </div>
    </div>
  );
}

  return (
        <>

    {/* ===== NEW BOTTOM HERO SHOWCASE SLIDER (Modern Premium Look) ===== */}
    <section className="bottom-slider-section">
      <div className="container">
        <div className="swiper bottomHeroSwiper">
          <div className="swiper-wrapper">
            
            {/* Slide 1: Advocate Bittoo Sharma */}
            <div className="swiper-slide">
              <div className="bottom-slide-card">
                <div className="row align-items-center">
                  <div className="col-lg-6">
                    <div className="bottom-slide-content">
                      <span className="bottom-slide-badge">
                        <i className="fa fa-balance-scale"></i> Senior Legal Counsel
                      </span>
                      <h2 className="bottom-slide-title">
                        Advocate <span className="gold-text">Bittoo Sharma</span>
                      </h2>
                      <h5 className="bottom-slide-subtitle">
                        Direct Legal Guidance & Dedicated Courtroom Representation
                      </h5>
                      <p className="bottom-slide-desc">
                        Providing comprehensive trial advocacy and strategic legal solutions with confidentiality, integrity, and proven legal acumen.
                      </p>
                      
                      <div className="bottom-slide-chips">
                        <a href="tel:9458551953" className="bottom-slide-chip">
                          <i className="fa fa-phone"></i> +91 94585 51953
                        </a>
                        <a href="tel:8077767256" className="bottom-slide-chip">
                          <i className="fa fa-phone"></i> +91 80777 67256
                        </a>
                        <span className="bottom-slide-chip">
                          <i className="fa fa-clock-o"></i> 10:00 AM - 5:00 PM
                        </span>
                      </div>

                      <div className="bottom-slide-actions">
                        <Link to="/Contactus" className="btn-gold-primary">
                          <i className="fa fa-envelope"></i> Contact Us
                        </Link>
                        <Link to="/About" className="btn-gold-outline">
                          <i className="fa fa-info-circle"></i> Read More
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="bottom-slide-image-wrapper">
                      <img src={slide2} alt="Advocate Bittoo Sharma" className="bottom-slide-img" />
                      <div className="bottom-slide-img-badge">
                        <div className="badge-icon">
                          <i className="fa fa-gavel"></i>
                        </div>
                        <div>
                          <span className="badge-text-primary">Advocate Bittoo Sharma</span>
                          <span className="badge-text-secondary">High Court & District Court Counsel</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Slide 2: Expertise In Criminal, Civil, Insurance & Matrimonial */}
            <div className="swiper-slide">
              <div className="bottom-slide-card">
                <div className="row align-items-center">
                  <div className="col-lg-6">
                    <div className="bottom-slide-content">
                      <span className="bottom-slide-badge">
                        <i className="fa fa-shield"></i> Core Practice Areas
                      </span>
                      <h2 className="bottom-slide-title">
                        Expertise In <span className="gold-text">Comprehensive Law</span>
                      </h2>
                      <h5 className="bottom-slide-subtitle">
                        Criminal, Civil, Insurance and Matrimonial Law Experience
                      </h5>
                      <p className="bottom-slide-desc">
                        Trust us to fight for your future with skill, determination, and unwavering commitment. We handle trials, bails, property suits, and sensitive matrimonial issues.
                      </p>
                      
                      <div className="bottom-slide-chips">
                        <span className="bottom-slide-chip"><i className="fa fa-check-circle"></i> Criminal Trial & Bail</span>
                        <span className="bottom-slide-chip"><i className="fa fa-check-circle"></i> Civil & Property Law</span>
                        <span className="bottom-slide-chip"><i className="fa fa-check-circle"></i> Insurance Matters</span>
                        <span className="bottom-slide-chip"><i className="fa fa-check-circle"></i> Matrimonial Disputes</span>
                      </div>

                      <div className="bottom-slide-actions">
                        <Link to="/Contactus" className="btn-gold-primary">
                          <i className="fa fa-calendar-check-o"></i> Book Consultation
                        </Link>
                        <Link to="/About" className="btn-gold-outline">
                          <i className="fa fa-book"></i> Read More
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="bottom-slide-image-wrapper">
                      <img src={slide1} alt="Legal Expertise" className="bottom-slide-img" />
                      <div className="bottom-slide-img-badge">
                        <div className="badge-icon">
                          <i className="fa fa-balance-scale"></i>
                        </div>
                        <div>
                          <span className="badge-text-primary">Trial & Bail Mastery</span>
                          <span className="badge-text-secondary">Criminal & Civil Litigation</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Slide 3: SARBIT LEGAL - Services */}
            <div className="swiper-slide">
              <div className="bottom-slide-card">
                <div className="row align-items-center">
                  <div className="col-lg-6">
                    <div className="bottom-slide-content">
                      <span className="bottom-slide-badge">
                        <i className="fa fa-university"></i> Sarbit Legal
                      </span>
                      <h2 className="bottom-slide-title">
                        Explore Our <span className="gold-text">Legal Services</span>
                      </h2>
                      <h5 className="bottom-slide-subtitle">
                        Committed To Deliver Strategic & Practical Solutions
                      </h5>
                      <p className="bottom-slide-desc">
                        We understand your cause, protect your rights at every jurisdiction, and are committed to deliver transparent and outcome-driven representation.
                      </p>
                      
                      <div className="bottom-slide-chips">
                        <span className="bottom-slide-chip"><i className="fa fa-star"></i> Strategic Advisory</span>
                        <span className="bottom-slide-chip"><i className="fa fa-star"></i> Prompt Legal Relief</span>
                        <span className="bottom-slide-chip"><i className="fa fa-star"></i> Court Decrees & Appeals</span>
                      </div>

                      <div className="bottom-slide-actions">
                        <Link to="/Contactus" className="btn-gold-primary">
                          <i className="fa fa-phone"></i> Contact Us
                        </Link>
                        <Link to="/About" className="btn-gold-outline">
                          <i className="fa fa-bullseye"></i> Read More
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="bottom-slide-image-wrapper">
                      <img src={slide2} alt="Sarbit Legal Services" className="bottom-slide-img" />
                      <div className="bottom-slide-img-badge">
                        <div className="badge-icon">
                          <i className="fa fa-shield"></i>
                        </div>
                        <div>
                          <span className="badge-text-primary">Sarbit Legal Practice</span>
                          <span className="badge-text-secondary">Where Truth Meets Justice</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Slide 4: Personalized Approach */}
            <div className="swiper-slide">
              <div className="bottom-slide-card">
                <div className="row align-items-center">
                  <div className="col-lg-6">
                    <div className="bottom-slide-content">
                      <span className="bottom-slide-badge">
                        <i className="fa fa-handshake-o"></i> Personalized Advocacy
                      </span>
                      <h2 className="bottom-slide-title">
                        Expertise In <span className="gold-text">Client Defense</span>
                      </h2>
                      <h5 className="bottom-slide-subtitle">
                        Criminal Law (Trial & Bail), Civil Law, Matrimonial Law
                      </h5>
                      <p className="bottom-slide-desc">
                        Our personalized approach ensures that you receive attentive, compassionate service from start to finish. Every case is treated with focused dedication.
                      </p>
                      
                      <div className="bottom-slide-chips">
                        <span className="bottom-slide-chip"><i className="fa fa-lock"></i> 100% Confidentiality</span>
                        <span className="bottom-slide-chip"><i className="fa fa-user"></i> One-on-One Attention</span>
                        <span className="bottom-slide-chip"><i className="fa fa-trophy"></i> High Client Satisfaction</span>
                      </div>

                      <div className="bottom-slide-actions">
                        <Link to="/Contactus" className="btn-gold-primary">
                          <i className="fa fa-paper-plane"></i> Contact Us
                        </Link>
                        <Link to="/About" className="btn-gold-outline">
                          <i className="fa fa-bookmark"></i> Read More
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="bottom-slide-image-wrapper">
                      <img src={slide3} alt="Client Defense" className="bottom-slide-img" />
                      <div className="bottom-slide-img-badge">
                        <div className="badge-icon">
                          <i className="fa fa-trophy"></i>
                        </div>
                        <div>
                          <span className="badge-text-primary">Attentive Advocacy</span>
                          <span className="badge-text-secondary">Start to Finish Support</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Slider Controls */}
          <div className="bottom-slider-controls">
            <div className="bottom-swiper-pagination"></div>
            <div className="bottom-slider-nav-btns">
              <button
                type="button"
                className="bottom-nav-btn bottom-swiper-button-prev"
                title="Previous Slide"
                aria-label="Previous Slide"
              >
                <i className="fa fa-chevron-left"></i>
              </button>
              <button
                type="button"
                className="bottom-nav-btn bottom-swiper-button-next"
                title="Next Slide"
                aria-label="Next Slide"
              >
                <i className="fa fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
<div className="col-md-12 bg-black text-white pt-1">
					<marquee behavior="right" direction="left" scrollamount="8" bgcolor="black">
  Expertise In - Criminal Law (Trial & Bail), Civil Law, Matrimonial Law.
</marquee>
</div>
    {/* ===== ABOUT US SECTION ===== */}
    <section className="sarbit-about-section">
      {/* Top Gold Divider Line */}
      <div className="sarbit-about-divider"></div>

      <div className="container">
        {/* Section Heading */}
        <div className="row justify-content-center mb-5">
          <div className="col-md-8 text-center">
            <span className="sarbit-about-subheading">
              <i className="fa fa-balance-scale"></i> Who We Are
            </span>
            <h2 className="sarbit-about-heading">
              About <span className="sarbit-gold">Sarbit Legal</span>
            </h2>
            <div className="sarbit-about-heading-underline"></div>
          </div>
        </div>

        <div className="row align-items-center">
          {/* Left: Image + Floating Badge */}
          <div className="col-lg-5 mb-5 mb-lg-0">
            <div className="sarbit-about-img-wrapper">
              <img
                src={about}
                alt="Sarbit Legal - Advocate Bittoo Sharma"
                className="sarbit-about-img"
              />
              {/* Floating Experience Badge */}
              <div className="sarbit-about-exp-badge">
                <span className="sarbit-about-exp-num">15+</span>
                <span className="sarbit-about-exp-txt">Years of<br/>Legal Excellence</span>
              </div>
              {/* Corner Accent */}
              <div className="sarbit-about-img-corner"></div>
            </div>
          </div>

          {/* Right: Content */}
          <div className="col-lg-7 ps-lg-5">
            <div className="sarbit-about-content">
              <p className="sarbit-about-lead">
                At <strong>Sarbit Legal</strong>, we believe that every individual deserves
                dedicated, transparent, and outcome-driven legal representation.
                Led by <strong>Advocate Bittoo Sharma</strong>, our firm brings
                deep expertise and unwavering commitment to every case.
              </p>
              <p className="sarbit-about-text">
                With specialization in <strong>Criminal Law (Trial &amp; Bail)</strong>,
                <strong> Civil Law</strong>, and <strong>Matrimonial Law</strong>, we combine
                thorough knowledge of the legal framework with practical strategies to protect
                your rights across all courts — from District Court to High Court.
              </p>

              {/* Core Values Grid */}
              <div className="row mt-4 mb-4">
                <div className="col-sm-6 mb-3">
                  <div className="sarbit-about-value-card">
                    <div className="sarbit-about-value-icon">
                      <i className="fa fa-gavel"></i>
                    </div>
                    <div className="sarbit-about-value-text">
                      <h5>Integrity</h5>
                      <p>We uphold the highest ethical standards in every case.</p>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 mb-3">
                  <div className="sarbit-about-value-card">
                    <div className="sarbit-about-value-icon">
                      <i className="fa fa-eye"></i>
                    </div>
                    <div className="sarbit-about-value-text">
                      <h5>Transparency</h5>
                      <p>Clear, honest communication with our clients at all times.</p>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 mb-3">
                  <div className="sarbit-about-value-card">
                    <div className="sarbit-about-value-icon">
                      <i className="fa fa-shield"></i>
                    </div>
                    <div className="sarbit-about-value-text">
                      <h5>Confidentiality</h5>
                      <p>Your personal matters are always handled with discretion.</p>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 mb-3">
                  <div className="sarbit-about-value-card">
                    <div className="sarbit-about-value-icon">
                      <i className="fa fa-trophy"></i>
                    </div>
                    <div className="sarbit-about-value-text">
                      <h5>Results-Driven</h5>
                      <p>Focused on delivering favorable outcomes for our clients.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="sarbit-about-actions">
                <Link to="/About" className="sarbit-about-btn-primary">
                  <i className="fa fa-info-circle"></i> Learn More About Us
                </Link>
                <Link to="/ConsultationBooking" className="sarbit-about-btn-outline">
                  <i className="fa fa-phone"></i>  Consultation Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gold Divider */}
      <div className="sarbit-about-divider mt-5"></div>
    </section>

    <section
      className="ftco-counter ftco-section ftco-no-pt mt-4 ftco-no-pb img"
      id="section-counter">
      <div className="container">
        <div className="row">
          <Counter target="3000" label="Trusted Clients" />
          <Counter target="1000" label="Honor's Awards" />
          <Counter target="2000" label="Expert Lawyers" />
          <Counter target="10540" label="Successful Cases" />
        </div>
      </div>
    </section>


    {/* ===== PRACTICE AREA SECTION (Premium Redesign) ===== */}
    <section className="pa-section">
      {/* Background decoration */}
      <div className="pa-bg-deco pa-bg-deco--left"></div>
      <div className="pa-bg-deco pa-bg-deco--right"></div>

      <div className="container">
        {/* Heading */}
        <div className="row justify-content-center">
          <div className="col-lg-7 text-center">
            <span className="pa-subheading">
              <i className="fa fa-gavel"></i> Our Cases
            </span>
            <h2 className="pa-heading">
              Practice <span className="pa-gold">Areas</span>
            </h2>
            <div className="pa-heading-line"></div>
            <p className="pa-heading-desc">
              We provide expert legal representation across a wide range of practice areas — 
              bringing skill, dedication, and proven results to every case.
            </p>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="row mt-5">
          {categories
            .filter(cat => cat.parent_id === 1)
            .map((cat, idx) => (
              <div className="col-xl-3 col-lg-4 col-md-6 mb-4" key={cat.category_id}>
                <div className="pa-card">
                  {/* Image */}
                  <div className="pa-card-img-box">
                    <img
                      src={getImageUrl(cat.image_url)}
                      alt={cat.category_name}
                      className="pa-card-img"
                      loading="lazy"
                      // onError={e => {
                      //   e.target.onerror = null;
                      //   e.target.src = "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80";
                      // }}
                    />
                    {/* Dark overlay */}
                    <div className="pa-card-overlay"></div>
                    {/* Number badge */}
                    <span className="pa-card-number">0{idx + 1}</span>
                  </div>

                  {/* Content */}
                  <div className="pa-card-body">
                    {/* Gold accent line */}
                    <div className="pa-card-accent"></div>
                    <div className="pa-card-icon">
                      <i className="fa fa-balance-scale"></i>
                    </div>
                    <h3 className="pa-card-title">{cat.category_name}</h3>
                    <p className="pa-card-desc">{cat.description}</p>
                    <Link to="/ConsultationBooking" className="pa-card-btn">
                      <span>Consult Now</span>
                      <i className="fa fa-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>

    {/* ===== NEW SECTION: CASE ORDERS SLIDER (Moves Left to Right) ===== */}
    <section className="ftco-section case-orders-section py-5">
      <div className="container">
        <div className="row justify-content-center pb-4">
          <div className="col-md-8 text-center heading-section">
            <span className="subheading" style={{ color: "#c49b63", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", fontSize: "14px" }}>
              Court Decrees & Judgments
            </span>
            <h2 className="mb-3" style={{ fontWeight: 700 }}>Case Orders & Judgments</h2>
            <p style={{ color: "#666", fontSize: "15px" }}>
              Certified court decrees and orders secured by our legal team. Click on any record to view or download the certified PDF copy.
            </p>
          </div>
        </div>
      </div>

      {/* Continuous Left-to-Right Moving Slider Track with Pause-on-Hover */}
      <div className="case-orders-marquee-wrapper">
        <div className="case-orders-track">
          {(caseOrders.length > 0 ? [...caseOrders, ...caseOrders] : []).map((order, index) => (
            <div className="case-order-card" key={`order-card-${order.id || index}-${index}`}>
              <div className="case-order-card-inner">
                <div className="case-order-img-box">
                   <div className="tm-card-divider"></div>
                  <Link to="/CaseOrder" >
                  <img
                    src={getImageUrl(order.image_url)}
                    alt={order.name || "Case Order"}
                    className="case-order-img"
                    // onError={(e) => {
                    //   e.target.onerror = null;
                    //   e.target.src = "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&auto=format&fit=crop&q=80";
                    // }}
                  />
                  </Link>
                  <span className="case-order-badge">
                    <i className="fa fa-file-pdf-o mr-1"></i> Order Copy
                  </span>
                </div>
                <div className="case-order-content">
                  <h4 className="case-order-title" title={order.case_title}>
                    {order.case_title || "Court Order"}
                  </h4>
                  <div className="case-order-meta">
                    <span className="case-order-name">
                      <i className="fa fa-user-circle"></i>
                      {order.name || "Authorized Party"}
                    </span>
                  </div>
                  {order.description && (
                    <p className="case-order-desc">{order.description}</p>
                  )}
                  <div className="case-order-action">
                    <a
                      href={getPdfUrl(order.pdf_url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="order-pdf-btn"
                    >
                      <i className="fa fa-file-pdf-o"></i>
                      <span>View Order (PDF)</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ===== OUR TEAM SECTION — Smooth Infinite Slider ===== */}
    <section className="tm-section">
      <div className="tm-bg-glow tm-bg-glow--top"></div>
      <div className="tm-bg-glow tm-bg-glow--bot"></div>

      {/* Heading — inside container */}
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-7 text-center">
            <span className="tm-subheading">
              <i className="fa fa-users"></i> Our People
            </span>
            <h2 className="tm-heading">
              Meet Our <span className="tm-gold">Legal Team</span>
            </h2>
            <div className="tm-heading-line"></div>
            <p className="tm-heading-desc">
              Our team of dedicated legal professionals brings decades of combined experience,
              relentless commitment, and deep courtroom expertise to protect your rights.
            </p>
          </div>
        </div>
      </div>

      {/* Full-width Smooth Slider Track */}
      <div className="tm-slider-outer mt-5">
        {members.length === 0 ? (
          <div className="tm-loading">
            <i className="fa fa-spinner fa-spin"></i>
            <p>Loading team members...</p>
          </div>
        ) : (
          <div className="tm-track">
            {/* Duplicate array 3x for seamless infinite loop */}
            {[...members, ...members, ...members].map((member, idx) => (
              <div className="tm-card" key={`tm-${member.id}-${idx}`}>
                {/* Animated top gold bar */}
                <div className="tm-card-top-bar"></div>

                {/* Image */}
                <div className="tm-card-img-wrap">
                  <img
                    src={getImageUrl(member.image_url)}
                    alt={member.name}
                    className="tm-card-img"
                    loading="lazy"
                    // onError={e => {
                    //   e.target.onerror = null;
                    //   e.target.src = {`backend/${member.image_url}`}
                    // }}
                  />
                  {/* Hover overlay with icons */}
                  <div className="tm-card-img-overlay">
                    <div className="tm-card-overlay-links">
                      <a href="#" className="tm-social-btn" title="Email" onClick={e => e.preventDefault()}>
                        <i className="fa fa-envelope"></i>
                      </a>
                      <a href="#" className="tm-social-btn" title="Profile" onClick={e => e.preventDefault()}>
                        <i className="fa fa-user"></i>
                      </a>
                      <a href="#" className="tm-social-btn" title="Call" onClick={e => e.preventDefault()}>
                        <i className="fa fa-phone"></i>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="tm-card-body">
                  <span className="tm-card-badge">
                    <i className="fa fa-gavel"></i> Legal Expert
                  </span>
                  <h4 className="tm-card-name">{member.name}</h4>
                  <p className="tm-card-desc">{member.description}</p>
                  <div className="tm-card-divider"></div>
                  <Link to="/ConsultationBooking" className="tm-card-btn">

                  
                    <i className="fa fa-calendar-check-o"></i>
                    <span>Book Consultation</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
		
		<section className="ftco-appointment ftco-section img" style={{ backgroundImage: "url('src/assets/bg_2.jpg')" }}>
			<div className="overlay"></div>
    	<div className="container">
    		<div className="row">
    			<div className="col-md-6 pr-md-5">
    				<div className="heading-section heading-section-white">
	            <h2 className="mb-3">We Have Great Results</h2>
	            <p>A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country, in which roasted parts of sentences fly into your mouth.</p>
	            <div className="row mt-md-4">
	            	<div className="col-lg-6">
	            		<div className="services d-flex w-100">
			    					<div className="icon icon-2 d-flex align-items-center justify-content-center">
			    						<span className="flaticon-medal"></span>
			    					</div>
			    					<div className="text pl-3">
			    						<h2>Award Winning</h2>
			    						<p>A small river named Duden flows by their place and supplies</p>
			    					</div>
			    				</div>
	            	</div>
	            	<div className="col-lg-6">
	            		<div className="services d-flex w-100">
			    					<div className="icon icon-2 d-flex align-items-center justify-content-center">
			    						<span className="flaticon-auction"></span>
			    					</div>
			    					<div className="text pl-3">
			    						<h2>60 Years of Experience</h2>
			    						<p>A small river named Duden flows by their place and supplies</p>
			    					</div>
			    				</div>
	            	</div>
	            	<div className="col-lg-12">
	            		<div className="services d-flex w-100">
			    					<div className="icon icon-2 d-flex align-items-center justify-content-center">
			    						<span className="flaticon-lawyer"></span>
			    					</div>
			    					<div className="text pl-3">
			    						<h2>Best Attorneys team</h2>
			    						<p>A small river named Duden flows by their place and supplies</p>
			    					</div>
			    				</div>
	            	</div>
	            </div>
    				</div>
    			</div>
    			<div className="col-md-6 half ftco-animate">
    				<h2 className="mb-4">Free Case Consultation</h2>
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
    	</div>
    </section>
    
        </>
    )
}

export default Home;