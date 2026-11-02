import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./CaseOrder.css";
import { API_BASE_URL, getImageUrl as resolveImageUrl, getPdfUrl as resolvePdfUrl } from "./config";
import { defaultOrders } from "./data/defaultData";

function CaseOrder() {
  const [orders, setOrders] = useState(defaultOrders);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPdfOrder, setSelectedPdfOrder] = useState(null);

  // Fetch case orders from MySQL `case_orders` table via backend
  const fetchCaseOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE_URL}/sarbit/case_orders`);
      if (Array.isArray(res.data)) {
        setOrders(res.data);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error("Error fetching case orders:", err);
      setError("Unable to load case orders from backend server. Please verify backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCaseOrders();
  }, []);

  // Helper for Image URLs
  const getImageUrl = (img) => resolveImageUrl(img, "/src/assets/case-1.jpg");

  // Helper for PDF URLs
  const getPdfUrl = (pdf) => resolvePdfUrl(pdf, "#");

  // Helper to determine status badge type
  const getOrderStatus = (desc) => {
    const text = (desc || "").toLowerCase();
    if (text.includes("grant")) {
      return { label: "Bail Granted", className: "granted", icon: "fa-check-circle" };
    }
    if (text.includes("pend")) {
      return { label: "In Progress", className: "pending", icon: "fa-hourglass-half" };
    }
    return { label: "Court Decree", className: "decree", icon: "fa-gavel" };
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      (order.case_title && order.case_title.toLowerCase().includes(search.toLowerCase())) ||
      (order.name && order.name.toLowerCase().includes(search.toLowerCase())) ||
      (order.description && order.description.toLowerCase().includes(search.toLowerCase()));

    const statusObj = getOrderStatus(order.description);
    const matchesFilter =
      statusFilter === "all" ||
      (statusFilter === "granted" && statusObj.className === "granted") ||
      (statusFilter === "pending" && statusObj.className === "pending") ||
      (statusFilter === "decree" && statusObj.className === "decree");

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="caseorder-page-wrapper">
      {/* 1. HERO BANNER WITH BREADCRUMBS */}
      <section
        className="caseorder-hero"
        style={{
          backgroundImage: "url('/src/assets/bg_1.jpg')",
        }}
      >
        <div className="caseorder-hero-overlay"></div>
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-9 col-md-11">
              <p className="caseorder-breadcrumbs">
                <Link to="/">Home</Link> &nbsp;/&nbsp; <span>Case Orders & Judgments</span>
              </p>
              <h1 className="caseorder-hero-title">
                Certified <span>Court Orders & Decrees</span>
              </h1>
              <p className="caseorder-hero-desc mx-auto">
                Official judgments, bail orders, and trial decrees successfully secured by our advocates.
                Transparent, legally certified records available for public and client verification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CREDIBILITY & STATS METRICS STRIP */}
      <section className="caseorder-stats-strip">
        <div className="container">
          <div className="row text-center text-md-left">
            <div className="col-lg-3 col-sm-6 mb-3 mb-lg-0">
              <div className="caseorder-stat-item justify-content-center justify-content-md-start">
                <div className="caseorder-stat-icon">
                  <i className="fa fa-file-text-o"></i>
                </div>
                <div>
                  <div className="caseorder-stat-num">100% Certified</div>
                  <div className="caseorder-stat-label">Official Court Copies</div>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-sm-6 mb-3 mb-lg-0">
              <div className="caseorder-stat-item justify-content-center justify-content-md-start">
                <div className="caseorder-stat-icon">
                  <i className="fa fa-shield"></i>
                </div>
                <div>
                  <div className="caseorder-stat-num">Bail & Trial Relief</div>
                  <div className="caseorder-stat-label">Regular & Anticipatory</div>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-sm-6 mb-3 mb-sm-0">
              <div className="caseorder-stat-item justify-content-center justify-content-md-start">
                <div className="caseorder-stat-icon">
                  <i className="fa fa-university"></i>
                </div>
                <div>
                  <div className="caseorder-stat-num">High Court</div>
                  <div className="caseorder-stat-label">& District Sessions</div>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-sm-6">
              <div className="caseorder-stat-item justify-content-center justify-content-md-start">
                <div className="caseorder-stat-icon">
                  <i className="fa fa-check-square-o"></i>
                </div>
                <div>
                  <div className="caseorder-stat-num">Verified Decrees</div>
                  <div className="caseorder-stat-label">Digital PDF Downloads</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MAIN CASE ORDERS DIRECTORY */}
      <section className="caseorder-main-section">
        <div className="container">
          {/* Section Heading */}
          <div className="text-center mb-4">
            <span className="caseorder-section-badge">
              <i className="fa fa-gavel"></i> Judicial Records
            </span>
            <h2 className="caseorder-section-heading">
              Case Orders & <span>Judgments</span>
            </h2>
            <div className="caseorder-gold-divider"></div>
            <p className="caseorder-section-subtitle">
              Browse through certified court decrees and trial judgments secured by our legal team.
              Click on any order to preview or download the certified PDF copy.
            </p>
          </div>

          {/* SEARCH & FILTER CONTROLS */}
          <div className="caseorder-filter-bar">
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
                    className="form-control caseorder-search-input border-left-0"
                    placeholder="Search by case title, advocate or relief..."
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
                <div className="caseorder-filter-pills justify-content-lg-end">
                  <span className="d-none d-sm-inline-block align-self-center mr-2 text-muted font-weight-bold" style={{ fontSize: "12px" }}>
                    Filter:
                  </span>
                  <button
                    type="button"
                    className={`caseorder-pill-btn ${statusFilter === "all" ? "active" : ""}`}
                    onClick={() => setStatusFilter("all")}
                  >
                    All Orders ({orders.length})
                  </button>
                  <button
                    type="button"
                    className={`caseorder-pill-btn ${statusFilter === "granted" ? "active" : ""}`}
                    onClick={() => setStatusFilter("granted")}
                  >
                    Bail Granted
                  </button>
                  <button
                    type="button"
                    className={`caseorder-pill-btn ${statusFilter === "pending" ? "active" : ""}`}
                    onClick={() => setStatusFilter("pending")}
                  >
                    In Progress
                  </button>
                  <button
                    type="button"
                    className={`caseorder-pill-btn ${statusFilter === "decree" ? "active" : ""}`}
                    onClick={() => setStatusFilter("decree")}
                  >
                    Decrees
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* LOADING STATE */}
          {loading && (
            <div className="caseorder-loading-state">
              <i className="fa fa-circle-o-notch fa-spin caseorder-loading-spinner"></i>
              <h5 className="font-weight-bold">Loading Court Orders...</h5>
              <p className="text-muted mb-0">Fetching certified case decrees from database</p>
            </div>
          )}

          {/* ERROR STATE */}
          {error && !loading && (
            <div className="alert alert-warning text-center p-4 rounded shadow-sm">
              <i className="fa fa-exclamation-triangle fa-2x text-warning mb-2 d-block"></i>
              <h5 className="font-weight-bold">Could not load case orders</h5>
              <p className="mb-3">{error}</p>
              <button onClick={fetchCaseOrders} className="btn btn-sm btn-dark">
                <i className="fa fa-refresh mr-1"></i> Try Again
              </button>
            </div>
          )}

          {/* EMPTY STATE */}
          {!loading && !error && filteredOrders.length === 0 && (
            <div className="caseorder-empty-state">
              <div className="mb-3">
                <i className="fa fa-folder-open-o fa-3x text-muted"></i>
              </div>
              <h4 className="font-weight-bold text-dark">No Case Orders Found</h4>
              <p className="text-muted mb-3">
                {search
                  ? `No court orders matched your search "${search}".`
                  : "No case orders are currently registered in the database."}
              </p>
              {search && (
                <button
                  className="btn btn-outline-dark btn-sm"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("all");
                  }}
                >
                  Reset Filters
                </button>
              )}
            </div>
          )}

          {/* ORDERS GRID */}
          {!loading && !error && filteredOrders.length > 0 && (
            <div className="row">
              {filteredOrders.map((order) => {
                const status = getOrderStatus(order.description);
                const pdfUrl = getPdfUrl(order.pdf_url);
                const orderDateFormatted = order.order_date
                  ? new Date(order.order_date).toLocaleDateString()
                  : order.created_at
                  ? new Date(order.created_at).toLocaleDateString()
                  : "Recent";

                return (
                  <div className="col-lg-4 col-md-6 mb-4 d-flex" key={order.id}>
                    <div className="caseorder-card w-100">
                      <div className="caseorder-card-top-bar"></div>

                      {/* Card Image Box */}
                      <div className="caseorder-img-box">
                        <img
                          src={getImageUrl(order.image_url)}
                          alt={order.case_title}
                          className="caseorder-img"
                          loading="lazy"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/src/assets/case-1.jpg";
                          }}
                        />
                        <span className="caseorder-pdf-badge">
                          <i className="fa fa-file-pdf-o mr-1"></i> Certified Copy
                        </span>
                        <span className={`caseorder-status-badge ${status.className}`}>
                          <i className={`fa ${status.icon} mr-1`}></i> {status.label}
                        </span>
                      </div>

                      {/* Card Body */}
                      <div className="caseorder-card-body">
                        <h3 className="caseorder-title" title={order.case_title}>
                          {order.case_title || "Court Order"}
                        </h3>

                        <div className="caseorder-advocate-row">
                          <i className="fa fa-user-circle"></i>
                          <span>Counsel: <strong>{order.name || "Authorized Advocate"}</strong></span>
                        </div>

                        <p className="caseorder-desc">
                          {order.description || "Certified copy of the official court order, issued under seal of the competent judicial magistrate."}
                        </p>

                        <div className="caseorder-meta-info">
                          <span>
                            <i className="fa fa-calendar-check-o mr-1"></i> Order Date: <strong>{orderDateFormatted}</strong>
                          </span>
                          <span>
                            <i className="fa fa-check text-success mr-1"></i> Verified
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="caseorder-actions-grid">
                          <button
                            type="button"
                            className="caseorder-btn-view"
                            onClick={() => setSelectedPdfOrder(order)}
                          >
                            <i className="fa fa-eye"></i>
                            <span>View PDF Order</span>
                          </button>

                          <a
                            href={pdfUrl}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="caseorder-btn-dl"
                            title="Download PDF Document"
                          >
                            <i className="fa fa-download"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 4. LEGAL COMPLIANCE & VERIFICATION BOX */}
          <div className="card shadow-sm p-4 mt-5 border-0" style={{ backgroundColor: "#f1f5f9", borderRadius: "16px", borderLeft: "5px solid #c49b63" }}>
            <div className="d-flex align-items-start">
              <div className="mr-3 mt-1 text-warning" style={{ fontSize: "24px" }}>
                <i className="fa fa-shield"></i>
              </div>
              <div>
                <h5 className="font-weight-bold text-dark mb-1">
                  Legal Compliance & Certified Document Verification
                </h5>
                <p className="text-secondary mb-0" style={{ fontSize: "14px", lineHeight: "1.6" }}>
                  All orders presented above are public certified copies issued by respective District Courts and the Hon'ble High Court. 
                  Copies are published strictly for client verification, legal case tracking, and educational demonstration under 
                  provisions of the Indian Evidence Act.
                </p>
              </div>
            </div>
          </div>

          {/* 5. BOTTOM CONSULTATION CTA BANNER */}
          <div className="caseorder-cta-banner mt-5">
            <div className="row align-items-center">
              <div className="col-lg-8 col-md-12 mb-3 mb-lg-0">
                <h3 className="caseorder-cta-title">
                  Facing A Similar Court Matter Or <span>Require Urgent Bail</span>?
                </h3>
                <p className="caseorder-cta-desc">
                  Schedule your direct <strong>2-Hour personalized legal consultation (₹5,000)</strong> with Advocate Bittoo Sharma
                  and senior defense counsel to prepare a rigorous bail petition or litigation strategy.
                </p>
              </div>
              <div className="col-lg-4 col-md-12 text-lg-right text-left">
                <div className="d-flex flex-wrap align-items-center caseorder-cta-actions">
                  <Link to="/ConsultationBooking" className="caseorder-cta-btn mr-2 mb-2">
                    <i className="fa fa-calendar-check-o"></i> Book Consultation
                  </Link>
                  <a href="tel:9458551953" className="caseorder-cta-btn-outline mb-2">
                    <i className="fa fa-phone"></i> Call 9458551953
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. INTERACTIVE PDF PREVIEW MODAL */}
      {selectedPdfOrder && (
        <div
          className="caseorder-modal-overlay"
          onClick={() => setSelectedPdfOrder(null)}
        >
          <div
            className="caseorder-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="caseorder-modal-header">
              <div>
                <h4 className="mb-0">
                  <i className="fa fa-file-pdf-o mr-2 text-warning"></i>
                  {selectedPdfOrder.case_title || "Court Order Document"}
                </h4>
                <small className="text-light" style={{ opacity: 0.85 }}>
                  Counsel: {selectedPdfOrder.name} &nbsp;|&nbsp; Relief: {selectedPdfOrder.description || "Certified Order"}
                </small>
              </div>
              <button
                type="button"
                className="caseorder-modal-close"
                onClick={() => setSelectedPdfOrder(null)}
                title="Close Viewer"
              >
                ✕
              </button>
            </div>

            <div className="caseorder-modal-viewer">
              <iframe
                src={getPdfUrl(selectedPdfOrder.pdf_url)}
                title={selectedPdfOrder.case_title}
              />
            </div>

            <div className="caseorder-modal-footer">
              <div className="d-flex align-items-center">
                <span className="badge badge-success mr-2 px-2 py-1">Certified Copy</span>
                <span className="text-muted" style={{ fontSize: "13px" }}>
                  Official Record: <code>{selectedPdfOrder.pdf_url}</code>
                </span>
              </div>
              <div className="d-flex gap-2">
                <a
                  href={getPdfUrl(selectedPdfOrder.pdf_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-outline-dark mr-2"
                >
                  <i className="fa fa-external-link mr-1"></i> Open in Full Tab
                </a>
                <a
                  href={getPdfUrl(selectedPdfOrder.pdf_url)}
                  download
                  className="btn btn-sm btn-warning font-weight-bold"
                  style={{ backgroundColor: "#c49b63", borderColor: "#c49b63", color: "#fff" }}
                >
                  <i className="fa fa-download mr-1"></i> Download PDF
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CaseOrder;
