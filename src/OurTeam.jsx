import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./OurTeam.css";

function OurTeam() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedMember, setSelectedMember] = useState(null);

  // Fetch team members from backend connected to MySQL `team_members`
  const fetchTeamMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("http://localhost:5000/sarbit/team_members");
      if (Array.isArray(res.data)) {
        setMembers(res.data);
      } else {
        setMembers([]);
      }
    } catch (err) {
      console.error("Error fetching team members:", err);
      setError("Unable to load team members from the server. Please ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  // Helper to resolve image URL with backend static files or fallback
  const getMemberImageUrl = (imgUrl) => {
    if (!imgUrl) return "/src/assets/person_1.jpg";
    if (imgUrl.startsWith("http")) return imgUrl;
    const clean = imgUrl.startsWith("/") ? imgUrl.substring(1) : imgUrl;
    return `http://localhost:5000/${clean}`;
  };

  // Extract unique roles for dynamic filter pills
  const availableRoles = [
    "all",
    ...Array.from(new Set(members.map((m) => m.role?.trim()).filter(Boolean))),
  ];

  // Filter members based on search and role
  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      (m.name && m.name.toLowerCase().includes(search.toLowerCase())) ||
      (m.role && m.role.toLowerCase().includes(search.toLowerCase())) ||
      (m.description && m.description.toLowerCase().includes(search.toLowerCase()));

    const matchesRole =
      roleFilter === "all" ||
      (m.role && m.role.trim().toLowerCase() === roleFilter.toLowerCase());

    return matchesSearch && matchesRole;
  });

  return (
    <div className="ourteam-page-wrapper">
      {/* 1. HERO BANNER WITH BREADCRUMBS */}
      <section
        className="ourteam-hero"
        style={{
          backgroundImage: "url('/src/assets/bg_2.jpg')",
        }}
      >
        <div className="ourteam-hero-overlay"></div>
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-9 col-md-11">
              <p className="ourteam-breadcrumbs">
                <Link to="/">Home</Link> &nbsp;/&nbsp; <span>Our Legal Team</span>
              </p>
              <h1 className="ourteam-hero-title">
                Meet Our <span>Legal Advocates & Team</span>
              </h1>
              <p className="ourteam-hero-desc mx-auto">
                Decades of combined courtroom excellence, criminal defense mastery, matrimonial
                counsel, and dedicated representation to defend your legal rights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS & CREDIBILITY STRIP */}
      <section className="ourteam-stats-strip">
        <div className="container">
          <div className="row text-center text-md-left">
            <div className="col-lg-3 col-sm-6 mb-3 mb-lg-0">
              <div className="ourteam-stat-item justify-content-center justify-content-md-start">
                <div className="ourteam-stat-icon">
                  <i className="fa fa-balance-scale"></i>
                </div>
                <div>
                  <div className="ourteam-stat-num">15+ Years</div>
                  <div className="ourteam-stat-label">Courtroom Practice</div>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-sm-6 mb-3 mb-lg-0">
              <div className="ourteam-stat-item justify-content-center justify-content-md-start">
                <div className="ourteam-stat-icon">
                  <i className="fa fa-gavel"></i>
                </div>
                <div>
                  <div className="ourteam-stat-num">500+ Cases</div>
                  <div className="ourteam-stat-label">Bails & Orders Won</div>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-sm-6 mb-3 mb-sm-0">
              <div className="ourteam-stat-item justify-content-center justify-content-md-start">
                <div className="ourteam-stat-icon">
                  <i className="fa fa-university"></i>
                </div>
                <div>
                  <div className="ourteam-stat-num">High Court</div>
                  <div className="ourteam-stat-label">& District Bar Council</div>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-sm-6">
              <div className="ourteam-stat-item justify-content-center justify-content-md-start">
                <div className="ourteam-stat-icon">
                  <i className="fa fa-handshake-o"></i>
                </div>
                <div>
                  <div className="ourteam-stat-num">100%</div>
                  <div className="ourteam-stat-label">Confidential Advisory</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MAIN DIRECTORY SECTION */}
      <section className="ourteam-main-section">
        <div className="container">
          {/* Header Title */}
          <div className="text-center mb-4">
            <span className="ourteam-section-badge">
              <i className="fa fa-users"></i> Qualified Advocates
            </span>
            <h2 className="ourteam-section-heading">
              Our <span>Legal Counselors</span>
            </h2>
            <div className="ourteam-gold-divider"></div>
            <p className="ourteam-section-subtitle">
              Browse through our practicing advocates and legal associates. Select an advocate to
              review specialization or schedule an in-person or online consultation.
            </p>
          </div>

          {/* SEARCH & FILTER BAR */}
          <div className="ourteam-filter-bar">
            <div className="row align-items-center">
              <div className="col-lg-5 col-md-12 mb-3 mb-lg-0">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text bg-white border-right-0 text-muted">
                      <i className="fa fa-search"></i>
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control ourteam-search-input border-left-0"
                    placeholder="Search by advocate name or specialization..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {search && (
                    <div className="input-group-append">
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => setSearch("")}
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="col-lg-7 col-md-12">
                <div className="ourteam-filter-pills justify-content-lg-end">
                  <span className="d-none d-sm-inline-block align-self-center mr-2 text-muted font-weight-bold" style={{ fontSize: "12px" }}>
                    Filter:
                  </span>
                  {availableRoles.map((roleKey) => (
                    <button
                      key={roleKey}
                      type="button"
                      className={`ourteam-pill-btn ${roleFilter === roleKey ? "active" : ""}`}
                      onClick={() => setRoleFilter(roleKey)}
                    >
                      {roleKey === "all" ? `All Advocates (${members.length})` : roleKey}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* LOADING STATE */}
          {loading && (
            <div className="ourteam-loading-state">
              <i className="fa fa-circle-o-notch fa-spin ourteam-loading-spinner"></i>
              <h5 className="font-weight-bold">Loading Legal Team...</h5>
              <p className="text-muted mb-0">Fetching advocate directory from database</p>
            </div>
          )}

          {/* ERROR STATE */}
          {error && !loading && (
            <div className="alert alert-warning text-center p-4 rounded shadow-sm">
              <i className="fa fa-exclamation-triangle fa-2x text-warning mb-2 d-block"></i>
              <h5 className="font-weight-bold">Could not load team members</h5>
              <p className="mb-3">{error}</p>
              <button onClick={fetchTeamMembers} className="btn btn-sm btn-dark">
                <i className="fa fa-refresh mr-1"></i> Try Again
              </button>
            </div>
          )}

          {/* EMPTY SEARCH RESULT */}
          {!loading && !error && filteredMembers.length === 0 && (
            <div className="ourteam-empty-state">
              <div className="mb-3">
                <i className="fa fa-user-times fa-3x text-muted"></i>
              </div>
              <h4 className="font-weight-bold text-dark">No Advocates Found</h4>
              <p className="text-muted mb-3">
                {search
                  ? `No team members matched your search "${search}".`
                  : "No team members are currently registered in the database."}
              </p>
              {search && (
                <button
                  className="btn btn-outline-dark btn-sm"
                  onClick={() => {
                    setSearch("");
                    setRoleFilter("all");
                  }}
                >
                  Reset Filters
                </button>
              )}
            </div>
          )}

          {/* TEAM MEMBERS GRID */}
          {!loading && !error && filteredMembers.length > 0 && (
            <div className="row">
              {filteredMembers.map((member) => (
                <div className="col-lg-4 col-md-6 mb-4 d-flex" key={member.id}>
                  <div className="ourteam-card w-100">
                    <div className="ourteam-card-top-bar"></div>

                    {/* Member Image & Overlay */}
                    <div className="ourteam-card-img-wrap">
                      <img
                        src={getMemberImageUrl(member.image_url)}
                        alt={member.name}
                        className="ourteam-card-img"
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/src/assets/person_1.jpg";
                        }}
                      />
                      <div className="ourteam-img-overlay">
                        <div className="ourteam-overlay-actions">
                          <a
                            href="tel:9458551953"
                            className="ourteam-action-circle"
                            title="Direct Call"
                          >
                            <i className="fa fa-phone"></i>
                          </a>
                          <a
                            href="mailto:ad.bksharma319@gmail.com"
                            className="ourteam-action-circle"
                            title="Send Email"
                          >
                            <i className="fa fa-envelope"></i>
                          </a>
                          <button
                            type="button"
                            className="ourteam-action-circle border-0"
                            title="View Full Profile"
                            onClick={() => setSelectedMember(member)}
                          >
                            <i className="fa fa-id-card-o"></i>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Member Body */}
                    <div className="ourteam-card-body">
                      <span className="ourteam-role-badge">
                        <i className="fa fa-gavel"></i>
                        {member.role || "Advocate"}
                      </span>

                      <h3 className="ourteam-member-name">{member.name}</h3>

                      <p className="ourteam-member-desc">
                        {member.description || "Experienced advocate specializing in strategic litigation, client representation, and legal advisory."}
                      </p>

                      {/* Specialty Tags */}
                      <div className="ourteam-specialty-tags">
                        <span className="ourteam-tag">Court Litigation</span>
                        <span className="ourteam-tag">Legal Advisory</span>
                        {member.description && member.description.toLowerCase().includes("bail") && (
                          <span className="ourteam-tag text-success font-weight-bold">Bail Matters</span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="ourteam-card-actions">
                        <Link to="/ConsultationBooking" className="ourteam-btn-book">
                          <i className="fa fa-calendar-check-o"></i>
                          <span>Book Session</span>
                        </Link>
                        <button
                          type="button"
                          className="ourteam-btn-profile"
                          onClick={() => setSelectedMember(member)}
                        >
                          <i className="fa fa-info-circle"></i>
                          <span>Profile</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 4. WHY CHOOSE OUR LEGAL TEAM */}
          <div className="ourteam-why-section rounded mt-5">
            <div className="container">
              <div className="text-center mb-5">
                <span className="ourteam-section-badge bg-transparent text-warning border-warning">
                  <i className="fa fa-shield"></i> Firm Principles
                </span>
                <h3 className="text-white font-weight-bold">
                  Why Entrust Your Matter To Our Advocates
                </h3>
                <div className="ourteam-gold-divider"></div>
              </div>

              <div className="row">
                <div className="col-lg-4 col-md-6 mb-4 mb-lg-0">
                  <div className="ourteam-why-card">
                    <div className="ourteam-why-icon">
                      <i className="fa fa-balance-scale"></i>
                    </div>
                    <h4>Courtroom Expertise</h4>
                    <p>
                      Extensive trial advocacy in District Courts, Sessions Courts, and High Court
                      with deep knowledge of criminal procedures and civil litigation.
                    </p>
                  </div>
                </div>

                <div className="col-lg-4 col-md-6 mb-4 mb-lg-0">
                  <div className="ourteam-why-card">
                    <div className="ourteam-why-icon">
                      <i className="fa fa-clock-o"></i>
                    </div>
                    <h4>Dedicated 2-Hour Strategy</h4>
                    <p>
                      Unlike rushed sessions, we allocate complete 2-hour consultation windows to
                      dissect every FIR, charge-sheet, property paper, or agreement.
                    </p>
                  </div>
                </div>

                <div className="col-lg-4 col-md-6">
                  <div className="ourteam-why-card">
                    <div className="ourteam-why-icon">
                      <i className="fa fa-lock"></i>
                    </div>
                    <h4>Absolute Privilege</h4>
                    <p>
                      Your conversations, case files, and background disclosures remain protected
                      under full advocate-client confidentiality privilege.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 5. BOTTOM CONSULTATION CTA BANNER */}
          <div className="ourteam-cta-banner mt-5">
            <div className="row align-items-center">
              <div className="col-lg-8 col-md-12 mb-3 mb-lg-0">
                <h3 className="ourteam-cta-title">
                  Require Direct Legal Guidance From <span>Our Advocates</span>?
                </h3>
                <p className="ourteam-cta-desc">
                  Schedule your personalized <strong>2-Hour consultation session (₹5,000)</strong> with
                  Advocate Bittoo Sharma or senior counsel. Pick your date and morning/evening slot online.
                </p>
              </div>
              <div className="col-lg-4 col-md-12 text-lg-right text-left">
                <div className="d-flex flex-wrap align-items-center ourteam-cta-actions">
                  <Link to="/ConsultationBooking" className="ourteam-cta-btn mr-2 mb-2">
                    <i className="fa fa-calendar"></i> Book Online
                  </Link>
                  <Link to="/Contactus" className="ourteam-cta-btn-outline mb-2">
                    <i className="fa fa-phone"></i> Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. ADVOCATE PROFILE MODAL */}
      {selectedMember && (
        <div
          className="ourteam-modal-overlay"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="ourteam-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="ourteam-modal-close"
              onClick={() => setSelectedMember(null)}
            >
              ✕
            </button>

            <img
              src={getMemberImageUrl(selectedMember.image_url)}
              alt={selectedMember.name}
              className="ourteam-modal-header-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/src/assets/person_1.jpg";
              }}
            />

            <div className="ourteam-modal-body">
              <span className="ourteam-role-badge mb-2">
                <i className="fa fa-gavel"></i> {selectedMember.role || "Advocate"}
              </span>

              <h3 className="font-weight-bold text-dark mb-1">{selectedMember.name}</h3>
              <p className="text-muted mb-3" style={{ fontSize: "14px" }}>
                Practicing Advocate — Sarbit Legal Law Firm
              </p>

              <hr className="my-3" />

              <h6 className="font-weight-bold text-dark mb-2">Specialization & Profile:</h6>
              <p className="text-secondary" style={{ fontSize: "14.5px", lineHeight: "1.7" }}>
                {selectedMember.description || "Dedicated legal professional with a focus on case preparation, thorough documentation, and courtroom representation."}
              </p>

              <div className="bg-light p-3 rounded mb-4 border">
                <div className="d-flex align-items-center mb-2">
                  <i className="fa fa-phone mr-3 text-warning font-weight-bold"></i>
                  <span>Direct Helpline: <strong>+91 9458551953</strong></span>
                </div>
                <div className="d-flex align-items-center">
                  <i className="fa fa-envelope mr-3 text-warning"></i>
                  <span>Official Email: <strong>ad.bksharma319@gmail.com</strong></span>
                </div>
              </div>

              <div className="d-flex gap-2">
                <Link
                  to="/ConsultationBooking"
                  className="btn btn-warning font-weight-bold flex-grow-1 mr-2"
                  style={{ backgroundColor: "#c49b63", borderColor: "#c49b63", color: "#fff" }}
                  onClick={() => setSelectedMember(null)}
                >
                  <i className="fa fa-calendar-check-o mr-1"></i> Book 2-Hour Consultation
                </Link>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setSelectedMember(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OurTeam;