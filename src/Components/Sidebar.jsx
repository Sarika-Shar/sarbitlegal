import React from "react";
import { Link, useLocation } from "react-router-dom";
import '../style.css';
import '../css/animate.css';
import '../css/flaticon.css';
import logo from '../assets/logo.png';

function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname.toLowerCase();

  const navItems = [
    {
      title: "Dashboard",
      path: "/AdminDashboard",
      icon: "fa fa-tachometer",
      badge: "Overview"
    },
    {
      title: "Team Members",
      path: "/AdminTeam",
      icon: "fa fa-users"
    },
    {
      title: "Case Studies (Categories)",
      path: "/AdminCaseStudies",
      icon: "fa fa-balance-scale"
    },
    {
      title: "Case Orders (PDFs)",
      path: "/AdminOrders",
      icon: "fa fa-file-pdf-o"
    },
    {
      title: "Appointments",
      path: "/AdminAppointments",
      icon: "fa fa-calendar-check-o"
    },
    {
      title: "Consultation Bookings",
      path: "/AdminConsultations",
      icon: "fa fa-handshake-o",
      badge: "Paid"
    }
  ];

  return (
    <div className="sarbit-admin-sidebar card shadow-sm border-0 mb-4" style={{ borderRadius: "14px", overflow: "hidden", background: "#ffffff" }}>
      {/* Sidebar Header */}
      <div 
        className="sidebar-header p-3 text-white text-center" 
        style={{ 
          background: "linear-gradient(135deg, #1d2227 0%, #2c343e 100%)",
          borderBottom: "3px solid #c59b27" 
        }}
      >
        <div className="d-flex align-items-center justify-content-center mb-2">
          {logo ? (
            <img 
              src={logo} 
              alt="Sarbit Logo" 
              style={{ maxHeight: "38px", objectFit: "contain", marginRight: "10px", filter: "brightness(0) invert(1)" }} 
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : null}
          <div className="text-left">
            <h5 className="mb-0 text-white font-weight-bold" style={{ letterSpacing: "1px", fontSize: "1.1rem" }}>SARBIT</h5>
            <small style={{ color: "#c59b27", fontSize: "0.75rem", letterSpacing: "1.5px", textTransform: "uppercase" }}>Admin Panel</small>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <div className="p-3">
        <small className="text-uppercase font-weight-bold text-muted px-2 d-block mb-2" style={{ fontSize: "0.7rem", letterSpacing: "1px" }}>
          Main Menu
        </small>
        <ul className="list-unstyled mb-0">
          {navItems.map((item, idx) => {
            const isActive = currentPath === item.path.toLowerCase();
            return (
              <li key={idx} className="mb-2">
                <Link
                  to={item.path}
                  className={`d-flex align-items-center justify-content-between p-2 rounded text-decoration-none transition-all ${isActive ? 'active-admin-link' : 'text-dark admin-link-hover'}`}
                  style={{
                    fontWeight: isActive ? "600" : "500",
                    fontSize: "0.92rem",
                    color: isActive ? "#ffffff" : "#2c343e",
                    backgroundColor: isActive ? "#1d2227" : "transparent",
                    borderLeft: isActive ? "4px solid #c59b27" : "4px solid transparent",
                    transition: "all 0.2s ease"
                  }}
                >
                  <div className="d-flex align-items-center">
                    <span 
                      className="d-inline-flex align-items-center justify-content-center mr-2 rounded" 
                      style={{ 
                        width: "32px", 
                        height: "32px", 
                        background: isActive ? "rgba(197, 155, 39, 0.2)" : "#f4f6f9",
                        color: isActive ? "#c59b27" : "#555" 
                      }}
                    >
                      <i className={item.icon}></i>
                    </span>
                    <span>{item.title}</span>
                  </div>
                  {item.badge && (
                    <span className="badge badge-warning" style={{ backgroundColor: "#c59b27", color: "#fff", fontSize: "0.68rem" }}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <hr className="my-3" style={{ borderColor: "#eee" }} />

        {/* Quick Links */}
        <small className="text-uppercase font-weight-bold text-muted px-2 d-block mb-2" style={{ fontSize: "0.7rem", letterSpacing: "1px" }}>
          Quick Shortcuts
        </small>
        <ul className="list-unstyled mb-0">
          <li className="mb-2">
            <Link 
              to="/" 
              target="_blank" 
              className="d-flex align-items-center p-2 rounded text-muted text-decoration-none admin-link-hover"
              style={{ fontSize: "0.88rem" }}
            >
              <i className="fa fa-external-link mr-2 text-primary"></i> Visit Website
            </Link>
          </li>
          <li className="mb-1">
            <Link 
              to="/Userform" 
              className="d-flex align-items-center p-2 rounded text-danger text-decoration-none admin-link-hover"
              style={{ fontSize: "0.88rem" }}
              onClick={() => {
                localStorage.removeItem("userId");
              }}
            >
              <i className="fa fa-sign-out mr-2"></i> Sign Out
            </Link>
          </li>
        </ul>
      </div>

      {/* Sidebar Footer Info */}
      <div className="p-2 text-center text-muted" style={{ backgroundColor: "#fbfbfc", borderTop: "1px solid #f0f0f0", fontSize: "0.75rem" }}>
        <span>Sarbit Legal v2.0</span>
      </div>
    </div>
  );
}

export default Sidebar;