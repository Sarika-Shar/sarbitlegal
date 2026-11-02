import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./About.css";
import { API_BASE_URL, getImageUrl } from "./config";

function About() {
  const [teamPreview, setTeamPreview] = useState([]);

  // Fetch team members for the leadership preview section
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/sarbit/team_members`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setTeamPreview(res.data.slice(0, 3));
        }
      })
      .catch((err) => console.log("Team preview fetch notice:", err.message));
  }, []);

  const getMemberImg = (url) => {
    if (!url) return "/src/assets/person_1.jpg";
    if (url.startsWith("http")) return url;
    const clean = url.startsWith("/") ? url.substring(1) : url;
    return getImageUrl(url, "/src/assets/person_1.jpg");
  };

  return (
    <div className="about-page-wrapper">
      {/* 1. HERO BANNER */}
      <section
        className="about-hero"
        style={{
          backgroundImage: "url('/src/assets/bg_2.jpg')",
        }}
      >
        <div className="about-hero-overlay"></div>
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-9 col-md-11">
              <p className="about-breadcrumbs">
                <Link to="/">Home</Link> &nbsp;/&nbsp; <span>About Our Law Firm</span>
              </p>
              <h1 className="about-hero-title">
                Dedicated To Justice, <span>Built On Integrity & Trust</span>
              </h1>
              <p className="about-hero-desc mx-auto">
                Over 15+ years of distinguished courtroom practice defending clients across Criminal Law,
                Bail Petitions, Civil & Property Litigation, Matrimonial Settlements, and High Court Writs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS & CREDIBILITY METRICS STRIP */}
      <section className="about-stats-strip">
        <div className="container">
          <div className="row text-center text-md-left">
            <div className="col-lg-3 col-sm-6 mb-3 mb-lg-0">
              <div className="about-stat-item justify-content-center justify-content-md-start">
                <div className="about-stat-icon">
                  <i className="fa fa-balance-scale"></i>
                </div>
                <div>
                  <div className="about-stat-num">15+ Years</div>
                  <div className="about-stat-label">Courtroom Experience</div>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-sm-6 mb-3 mb-lg-0">
              <div className="about-stat-item justify-content-center justify-content-md-start">
                <div className="about-stat-icon">
                  <i className="fa fa-gavel"></i>
                </div>
                <div>
                  <div className="about-stat-num">500+ Cases</div>
                  <div className="about-stat-label">Bails & Decrees Secured</div>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-sm-6 mb-3 mb-sm-0">
              <div className="about-stat-item justify-content-center justify-content-md-start">
                <div className="about-stat-icon">
                  <i className="fa fa-university"></i>
                </div>
                <div>
                  <div className="about-stat-num">High Court</div>
                  <div className="about-stat-label">& District Bar Practice</div>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-sm-6">
              <div className="about-stat-item justify-content-center justify-content-md-start">
                <div className="about-stat-icon">
                  <i className="fa fa-shield"></i>
                </div>
                <div>
                  <div className="about-stat-num">100%</div>
                  <div className="about-stat-label">Client Confidentiality</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FOUNDER & FIRM OVERVIEW SECTION */}
      <section className="about-section">
        <div className="container">
          <div className="row align-items-center">
            {/* Left Image Column */}
            <div className="col-lg-5 col-md-12 mb-5 mb-lg-0">
              <div className="about-intro-img-box">
                <img
                  src="/src/assets/about-1.jpg"
                  alt="Advocate Bittoo Sharma & Legal Team"
                  className="about-intro-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/src/assets/slide1.jpg";
                  }}
                />
                <div className="about-floating-badge">
                  <div className="exp-num">15+</div>
                  <p className="exp-text">Years of Legal Excellence & Courtroom Defense</p>
                </div>
              </div>
            </div>

            {/* Right Content Column */}
            <div className="col-lg-7 col-md-12 pl-lg-5">
              <span className="about-section-badge">
                <i className="fa fa-university"></i> About Sarbit Legal
              </span>
              <h2 className="about-section-heading">
                Pioneering Legal Advocacy Led by <span>Advocate Bittoo Sharma</span>
              </h2>
              <div className="about-gold-divider"></div>

              <p className="text-secondary" style={{ fontSize: "15px", lineHeight: "1.7" }}>
                Founded with a resolute commitment to justice, <strong>Sarbit Legal Law Firm</strong> is
                recognized for relentless courtroom representation and strategic legal counsel. Led by
                <strong> Advocate Bittoo Sharma</strong>, our firm brings together accomplished advocates,
                specialized legal advisers, and seasoned litigators.
              </p>

              <p className="text-secondary" style={{ fontSize: "15px", lineHeight: "1.7" }}>
                Whether navigating complex criminal trials under the Indian Penal Code, securing urgent regular
                or anticipatory bail, resolving intricate property partition disputes, or negotiating sensitive
                matrimonial settlements, we fight fearlessly for our clients' rights at every judicial forum.
              </p>

              <div className="about-quote-box">
                <p>
                  "Justice is not a privilege; it is an undeniable right. Our mission is to provide thorough,
                  uncompromising, and fearless legal protection for every individual who places their trust in us."
                </p>
                <div className="author">
                  — Advocate Bittoo Sharma, <span className="text-muted font-weight-normal">Senior Counsel & Managing Advocate</span>
                </div>
              </div>

              <div className="d-flex flex-wrap align-items-center mt-4">
                <Link to="/ConsultationBooking" className="btn btn-warning font-weight-bold mr-3 mb-2" style={{ backgroundColor: "#c49b63", borderColor: "#c49b63", color: "#fff", padding: "12px 24px", borderRadius: "8px" }}>
                  <i className="fa fa-calendar-check-o mr-1"></i> Book Consultation (₹5,000)
                </Link>
                <Link to="/OurTeam" className="btn btn-outline-dark font-weight-bold mb-2" style={{ padding: "12px 24px", borderRadius: "8px" }}>
                  <i className="fa fa-users mr-1"></i> Meet Our Legal Team
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PRACTICE PILLARS */}
      {/* <section className="about-section bg-light" style={{ borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0" }}>
        <div className="container">
          <div className="text-center">
            <span className="about-section-badge">
              <i className="fa fa-gavel"></i> Core Disciplines
            </span>
            <h2 className="about-section-heading">
              Our Pillars of <span>Legal Practice</span>
            </h2>
            <div className="about-gold-divider center"></div>
            <p className="text-muted mx-auto" style={{ maxWidth: "640px", fontSize: "15px" }}>
              Comprehensive legal representation across diverse branches of Indian jurisprudence with specialized
              defense teams.
            </p>
          </div>

          <div className="about-pillars-grid">
            <div className="about-pillar-card">
              <div className="about-pillar-icon">
                <i className="fa fa-shield"></i>
              </div>
              <h4>Criminal Trial & Bail Defense</h4>
              <p>
                Aggressive representation in Sessions Courts and the High Court for Regular Bail, Anticipatory Bail,
                Interim Relief, Quashing of FIRs, and trial cross-examinations.
              </p>
            </div>

            <div className="about-pillar-card">
              <div className="about-pillar-icon">
                <i className="fa fa-building-o"></i>
              </div>
              <h4>Civil & Property Litigation</h4>
              <p>
                Title declaration suits, property partition, boundary disputes, injunctions, mutation appeals, and
                enforcement of commercial agreements and builder-buyer disputes.
              </p>
            </div>

            <div className="about-pillar-card">
              <div className="about-pillar-icon">
                <i className="fa fa-heartbeat"></i>
              </div>
              <h4>Matrimonial & Family Matters</h4>
              <p>
                Compassionate yet strategic advocacy in mutual & contested divorce, child custody petitions, 
                maintenance claims (Sec 125 CrPC), and domestic violence settlements.
              </p>
            </div>

            <div className="about-pillar-card">
              <div className="about-pillar-icon">
                <i className="fa fa-briefcase"></i>
              </div>
              <h4>Corporate & Legal Advisory</h4>
              <p>
                Pre-litigation dispute arbitration, drafting legal notices, contract vetting, partnership disputes,
                and regulatory compliance for businesses and entrepreneurs.
              </p>
            </div>
          </div>
        </div>
      </section> */}

      {/* 5. HOW WE WORK: PROCEDURAL ROADMAP */}
      <section className="about-process-section">
        <div className="container">
          <div className="text-center mb-5">
            <span className="about-section-badge bg-transparent text-warning border-warning">
              <i className="fa fa-road"></i> Core Disciplines
            </span>
            <h2 className="about-section-heading text-white">
              Our Pillars of <span>Legal Practice</span>
            </h2>
            <div className="about-gold-divider center"></div>
            <p className="text-light mx-auto" style={{ maxWidth: "620px", fontSize: "15px", opacity: 0.85 }}>
             Comprehensive legal representation across diverse branches of Indian jurisprudence with specialized
              defense teams.   </p>
          </div>

          <div className="row">
            <div className="col-lg-3 col-md-6 mb-4 mb-lg-0">
              <div className="about-process-card">
                <span className="about-process-step">01</span>
                <div className="about-process-icon">
                  <i className="fa fa-calendar-check-o"></i>
                </div>
                <h4>Criminal Trial & Bail Defense</h4>
                <p>
                  Aggressive representation in Sessions Courts and the High Court for Regular Bail, Anticipatory Bail, Interim Relief, Quashing of FIRs, and trial cross-examinations.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 mb-4 mb-lg-0">
              <div className="about-process-card">
                <span className="about-process-step">02</span>
                <div className="about-process-icon">
                  <i className="fa fa-search"></i>
                </div>
                <h4>Civil & Property Litigation</h4>
                <p>
                  Title declaration suits, property partition, boundary disputes, injunctions, mutation appeals, and enforcement of commercial agreements and builder-buyer disputes.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 mb-4 mb-lg-0">
              <div className="about-process-card">
                <span className="about-process-step">03</span>
                <div className="about-process-icon">
                  <i className="fa fa-file-text-o"></i>
                </div>
                <h4>Matrimonial & Family Matters</h4>
                <p>
                  Compassionate yet strategic advocacy in mutual & contested divorce, child custody petitions, maintenance claims (Sec 125 CrPC), and domestic violence settlements.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="about-process-card">
                <span className="about-process-step">04</span>
                <div className="about-process-icon">
                  <i className="fa fa-gavel"></i>
                </div>
                <h4>Corporate & Legal Advisory</h4>
                <p>
                  Pre-litigation dispute arbitration, drafting legal notices, contract vetting, partnership disputes, and regulatory compliance for businesses and entrepreneurs.


                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. ETHICAL VALUES & COMMITMENTS */}
     {/*  <section className="about-values-section">
        <div className="container">
          <div className="text-center mb-5">
            <span className="about-section-badge">
              <i className="fa fa-handshake-o"></i> Uncompromising Ethics
            </span>
            <h2 className="about-section-heading">
              Why Clients Put Their <span>Trust In Us</span>
            </h2>
            <div className="about-gold-divider center"></div>
          </div>

          <div className="row">
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="about-value-box">
                <h5>
                  <i className="fa fa-user-secret"></i> Strict Legal Privilege
                </h5>
                <p>
                  Every disclosure made to our advocates is guarded under legal privilege. We maintain impenetrable client
                  confidentiality protocols.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 mb-4">
              <div className="about-value-box">
                <h5>
                  <i className="fa fa-certificate"></i> Certified Court Orders
                </h5>
                <p>
                  We believe in verifiable track records. All court decrees and bail orders achieved are verified and certified
                  under the Indian Evidence Act.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 mb-4">
              <div className="about-value-box">
                <h5>
                  <i className="fa fa-eye"></i> Transparent Pricing & No Hidden Fees
                </h5>
                <p>
                  Complete clarity in professional consultation fees (₹5,000 for 2 Hours) and case retainers with digital
                  payment confirmations.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 mb-4 mb-lg-0">
              <div className="about-value-box">
                <h5>
                  <i className="fa fa-hourglass-start"></i> Dedicated 2-Hour Windows
                </h5>
                <p>
                  Unlike rushed legal clinics, we never restrict discussions to 5 minutes. We invest dedicated 2-hour slots
                  for every client.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
              <div className="about-value-box">
                <h5>
                  <i className="fa fa-phone"></i> Direct Advocate Helpline
                </h5>
                <p>
                  Direct access to senior advocates in emergencies (urgent bail hearings, arrest threats, or immediate stay motions).
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="about-value-box">
                <h5>
                  <i className="fa fa-check-circle"></i> High Bar Council Standards
                </h5>
                <p>
                  Strict adherence to Bar Council of India professional ethics and code of conduct for all practicing advocates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* 7. LEADERSHIP PREVIEW SECTION (from Database) */}
      {teamPreview.length > 0 && (
        <section className="about-section" style={{ borderTop: "1px solid #e2e8f0" }}>
          <div className="container">
            <div className="text-center mb-5">
              <span className="about-section-badge">
                <i className="fa fa-users"></i> Meet The Leadership
              </span>
              <h2 className="about-section-heading">
                Experienced <span>Legal Advocates</span>
              </h2>
              <div className="about-gold-divider center"></div>
              <p className="text-muted mx-auto" style={{ maxWidth: "600px" }}>
                Our team of dedicated advocates brings decades of combined trial mastery to protect your rights.
              </p>
            </div>

            <div className="row justify-content-center">
              {teamPreview.map((member) => (
                <div className="col-lg-4 col-md-6 mb-4" key={member.id}>
                  <div className="card shadow-sm h-100 border-0" style={{ borderRadius: "16px", overflow: "hidden", border: "1px solid #e2e8f0" }}>
                    <div style={{ height: "260px", overflow: "hidden", backgroundColor: "#0e1c2f" }}>
                      <img
                        src={getMemberImg(member.image_url)}
                        alt={member.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/src/assets/person_1.jpg";
                        }}
                      />
                    </div>
                    <div className="card-body p-4 text-center">
                      <span className="badge badge-light border text-uppercase font-weight-bold mb-2 px-3 py-1 text-warning" style={{ fontSize: "11px" }}>
                        {member.role || "Advocate"}
                      </span>
                      <h4 className="font-weight-bold text-dark mb-2">{member.name}</h4>
                      <p className="text-secondary small mb-3">
                        {member.description || "Senior legal advocate specializing in litigation and courtroom advocacy."}
                      </p>
                      <Link to="/ConsultationBooking" className="btn btn-sm btn-outline-warning font-weight-bold" style={{ color: "#c49b63", borderColor: "#c49b63" }}>
                        <i className="fa fa-calendar mr-1"></i> Book Consultation
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-4">
              <Link to="/OurTeam" className="btn btn-dark font-weight-bold" style={{ padding: "10px 24px", borderRadius: "8px" }}>
                <i className="fa fa-users mr-2"></i> View All Practicing Advocates →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 8. BOTTOM CONSULTATION CTA BANNER */}
      <div className="container pb-5">
        <div className="about-cta-banner">
          <div className="row align-items-center">
            <div className="col-lg-8 col-md-12 mb-3 mb-lg-0">
              <h3 className="about-cta-title">
                Require Immediate Legal Counsel From <span>Our Senior Advocates</span>?
              </h3>
              <p className="about-cta-desc">
                Schedule your dedicated <strong>2-Hour consultation session (₹5,000)</strong> with Advocate Bittoo Sharma
                and senior legal counsel. Select your date, morning or evening timing, and confirm with ease.
              </p>
            </div>
            <div className="col-lg-4 col-md-12 text-lg-right text-left">
              <div className="d-flex flex-wrap align-items-center about-cta-actions">
                <Link to="/ConsultationBooking" className="about-cta-btn mr-2 mb-2">
                  <i className="fa fa-calendar-check-o"></i> Book Consultation
                </Link>
                <a href="tel:9458551953" className="about-cta-btn-outline mb-2">
                  <i className="fa fa-phone"></i> Call 9458551953
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;