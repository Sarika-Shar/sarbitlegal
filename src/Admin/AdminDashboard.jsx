import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { API_BASE_URL, getImageUrl, getPdfUrl } from "../config";
import Sidebar from "../Components/Sidebar";

function AdminDashboard() {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [stats, setStats] = useState({
    team_members_count: 0,
    categories_count: 0,
    case_orders_count: 0,
    total_cases_count: 0,
    appointments_count: 0,
    consultations_count: 0,
    consultations_revenue: 0,
    categories: [],
    recent_orders: [],
    recent_appointments: [],
    recent_consultations: [],
    team_members: []
  });
  const [categorySearch, setCategorySearch] = useState("");
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());
  const navigate = useNavigate();

  // 1. Auth Guard & User Check - Login ke bina access block
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    
    // Agar login nahi hai (userId missing), to turant /Userform par bhej do
    if (!userId) {
      navigate("/Userform", { replace: true });
      return;
    }

    // User verify karna
    axios
      .get(`${API_BASE_URL}/sarbit/registration/${userId}`)
      .then((res) => {
        if (res.data && (res.data.id || res.data.Uname)) {
          setUser(res.data);
          setIsAuthenticated(true);
          setAuthLoading(false);
          fetchDashboardData();
        } else {
          // Database me user nahi mila to session clear karo
          localStorage.removeItem("userId");
          navigate("/Userform", { replace: true });
        }
      })
      .catch((err) => {
        console.error("Auth verification error:", err);
        if (err.response && (err.response.status === 404 || err.response.status === 401)) {
          localStorage.removeItem("userId");
          navigate("/Userform", { replace: true });
        } else {
          // Backend connectivity issue hone par bhi valid saved session allow karega
          setIsAuthenticated(true);
          setAuthLoading(false);
          fetchDashboardData();
        }
      });
  }, [navigate]);

  // 2. Fetch Dashboard Counts & Breakdown (with resilient fallback)
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Pehle backend ke dedicated dashboard/stats route ko try karte hain
      const res = await axios.get(`${API_BASE_URL}/sarbit/dashboard/stats`);
      if (res.data) {
        // Fetch team members list for quick preview
        let teamList = [];
        try {
          const teamRes = await axios.get(`${API_BASE_URL}/sarbit/team_members`);
          teamList = Array.isArray(teamRes.data) ? teamRes.data : [];
        } catch (e) {
          console.warn("Could not load full team list:", e);
        }

        setStats({
          team_members_count: res.data.team_members_count || 0,
          categories_count: res.data.categories_count || 0,
          case_orders_count: res.data.case_orders_count || 0,
          total_cases_count: res.data.total_cases_count || (res.data.categories_count + res.data.case_orders_count),
          appointments_count: res.data.appointments_count || 0,
          consultations_count: res.data.consultations_count || 0,
          consultations_revenue: res.data.consultations_revenue || 0,
          categories: res.data.categories || [],
          recent_orders: res.data.recent_orders || [],
          recent_appointments: res.data.recent_appointments || [],
          recent_consultations: res.data.recent_consultations || [],
          team_members: teamList
        });
        setLastUpdated(new Date().toLocaleTimeString());
        setLoading(false);
        return;
      }
    } catch (err) {
      console.warn("Dashboard stats route not available yet, fetching individual APIs:", err);
    }

    // Fallback: Individual endpoints se calculate karna agar backend restart na hua ho
    try {
      const [teamRes, catRes, ordersRes, apptRes, consultRes] = await Promise.allSettled([
        axios.get(`${API_BASE_URL}/sarbit/team_members`),
        axios.get(`${API_BASE_URL}/sarbit/category`),
        axios.get(`${API_BASE_URL}/sarbit/case_orders`),
        axios.get(`${API_BASE_URL}/sarbit/appointment_form`),
        axios.get(`${API_BASE_URL}/sarbit/consultation_bookings`),
      ]);

      const teamData = teamRes.status === "fulfilled" && Array.isArray(teamRes.value.data) ? teamRes.value.data : [];
      const catData = catRes.status === "fulfilled" && Array.isArray(catRes.value.data) ? catRes.value.data : [];
      const ordersData = ordersRes.status === "fulfilled" && Array.isArray(ordersRes.value.data) ? ordersRes.value.data : [];
      const apptData = apptRes.status === "fulfilled" && Array.isArray(apptRes.value.data) ? apptRes.value.data : [];
      const consultData = consultRes.status === "fulfilled" && Array.isArray(consultRes.value.data) ? consultRes.value.data : [];

      const totalRevenue = consultData.reduce((acc, curr) => acc + (parseFloat(curr.fee) || 0), 0);

      // Category wise count calculation
      const categoryWise = catData.map((cat) => {
        const catName = (cat.category_name || "").toLowerCase();
        const matchingOrders = ordersData.filter(
          (co) =>
            (co.case_title && co.case_title.toLowerCase().includes(catName)) ||
            (co.description && co.description.toLowerCase().includes(catName))
        );
        const matchingAppointments = apptData.filter(
          (apt) => apt.case_type && apt.case_type.toLowerCase().includes(catName)
        );
        const matchingConsultations = consultData.filter(
          (cb) => cb.case_type && cb.case_type.toLowerCase().includes(catName)
        );

        return {
          category_id: cat.category_id,
          category_name: cat.category_name,
          description: cat.description,
          image_url: cat.image_url,
          parent_id: cat.parent_id,
          cases_count: matchingOrders.length,
          appointments_count: matchingAppointments.length,
          consultations_count: matchingConsultations.length,
          total_count: matchingOrders.length + matchingAppointments.length + matchingConsultations.length,
        };
      });

      setStats({
        team_members_count: teamData.length,
        categories_count: catData.length,
        case_orders_count: ordersData.length,
        total_cases_count: catData.length + ordersData.length,
        appointments_count: apptData.length,
        consultations_count: consultData.length,
        consultations_revenue: totalRevenue,
        categories: categoryWise,
        recent_orders: ordersData.slice(0, 5),
        recent_appointments: apptData.slice(0, 5),
        recent_consultations: consultData.slice(0, 5),
        team_members: teamData,
      });
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (fallbackErr) {
      console.error("Error loading dashboard counts:", fallbackErr);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("No active user ID found.");
      return;
    }
    if (window.confirm("Are you sure you want to delete your administrator profile?")) {
      axios
        .delete(`${API_BASE_URL}/sarbit/registration/delete/${userId}`)
        .then(() => {
          alert("Account Deleted Successfully");
          localStorage.removeItem("userId");
          navigate("/Userform");
        })
        .catch((err) => console.log(err));
    }
  };

  const handleEdit = () => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      navigate(`/edit/${userId}`);
    } else {
      navigate("/Userform");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/Userform");
  };

  // Filter categories by search keyword
  const filteredCategories = useMemo(() => {
    if (!categorySearch.trim()) return stats.categories;
    const query = categorySearch.toLowerCase();
    return stats.categories.filter(
      (c) =>
        (c.category_name && c.category_name.toLowerCase().includes(query)) ||
        (c.description && c.description.toLowerCase().includes(query))
    );
  }, [stats.categories, categorySearch]);

  // If not authenticated or still verifying, block dashboard rendering
  if (authLoading || !isAuthenticated) {

    return (
      <div 
        className="d-flex flex-column align-items-center justify-content-center text-center p-5" 
        style={{ minHeight: "75vh", backgroundColor: "#f4f6fa" }}
      >
        <div 
          className="spinner-border mb-3" 
          role="status" 
          style={{ width: "3.5rem", height: "3.5rem", color: "#c59b27" }}
        >
          <span className="sr-only">Checking authorization...</span>
        </div>
        <h4 className="text-dark font-weight-bold">Verifying Admin Access...</h4>
        <p className="text-muted" style={{ maxWidth: "420px" }}>
          This page requires administrator authorization. If you are not logged in, you will be redirected to the login portal.
        </p>
      </div>
    );
  }

  return (

    <div className="sarbit-admin-wrapper" style={{ backgroundColor: "#f4f6fa", minHeight: "100vh", padding: "30px 15px" }}>
      <div className="container-fluid" style={{ maxWidth: "1400px" }}>
        
        {/* TOP BRANDING & WELCOME BAR */}
        <div 
          className="card border-0 shadow-sm p-4 mb-4 text-white" 
          style={{ 
            background: "linear-gradient(135deg, #161b22 0%, #1f2937 50%, #111827 100%)",
            borderRadius: "16px",
            borderLeft: "6px solid #c59b27"
          }}
        >
          <div className="row align-items-center">
            <div className="col-lg-7 col-md-12 mb-3 mb-lg-0">
              <div className="d-flex align-items-center">
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center mr-3 shadow"
                  style={{ width: "56px", height: "56px", backgroundColor: "#c59b27", color: "#111", fontSize: "1.6rem" }}
                >
                  <i className="fa fa-shield"></i>
                </div>
                <div>
                  <div className="d-flex align-items-center flex-wrap">
                    <h3 className="mb-0 text-white font-weight-bold mr-2" style={{ letterSpacing: "0.5px" }}>
                      Admin Control Center
                    </h3>
                    <span className="badge badge-warning text-dark px-2 py-1 font-weight-bold" style={{ backgroundColor: "#c59b27", fontSize: "0.75rem" }}>
                      LIVE PANEL
                    </span>
                  </div>
                  <p className="mb-0 text-light mt-1" style={{ fontSize: "0.95rem", opacity: 0.9 }}>
                    Welcome back, <strong>{user?.Sname || user?.Uname || "Administrator"}</strong> | Sarbit Legal Law Firm
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-5 col-md-12 text-lg-right text-md-left">
              <div className="d-flex align-items-center justify-content-lg-end flex-wrap">
                <span className="text-muted mr-3 mb-2 mb-sm-0" style={{ fontSize: "0.85rem", color: "#adb5bd" }}>
                  <i className="fa fa-clock-o mr-1 text-warning"></i> Updated: {lastUpdated}
                </span>
                <button 
                  onClick={fetchDashboardData} 
                  className="btn btn-outline-light btn-sm mr-2 mb-2 mb-sm-0" 
                  title="Reload counts"
                  style={{ borderRadius: "8px", borderColor: "rgba(255,255,255,0.3)" }}
                >
                  <i className={`fa fa-refresh mr-1 ${loading ? 'fa-spin' : ''}`}></i> Refresh
                </button>
                <button 
                  onClick={handleLogout} 
                  className="btn btn-danger btn-sm mb-2 mb-sm-0 shadow-sm"
                  style={{ borderRadius: "8px", backgroundColor: "#dc3545", borderColor: "#dc3545" }}
                >
                  <i className="fa fa-sign-out mr-1"></i> Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN BODY: SIDEBAR + DASHBOARD CONTENT */}
        <div className="row">
          
          {/* LEFT COLUMN: SIDEBAR */}
          <div className="col-xl-3 col-lg-4 col-md-12 mb-4">
            <Sidebar />

            {/* ADMIN PROFILE DETAILS WIDGET */}
            <div className="card border-0 shadow-sm mt-3" style={{ borderRadius: "14px", overflow: "hidden" }}>
              <div 
                className="card-header border-0 py-3 text-white" 
                style={{ background: "linear-gradient(135deg, #1d2227 0%, #2c343e 100%)", borderBottom: "2px solid #c59b27" }}
              >
                <h6 className="mb-0 font-weight-bold d-flex align-items-center text-white">
                  <i className="fa fa-user-circle-o mr-2" style={{ color: "#c59b27" }}></i> Admin Credentials
                </h6>
              </div>
              <div className="card-body p-3 bg-white">
                <div className="text-center mb-3">
                  <div 
                    className="rounded-circle d-inline-flex align-items-center justify-content-center mx-auto mb-2 text-white font-weight-bold shadow-sm"
                    style={{ width: "65px", height: "65px", background: "linear-gradient(135deg, #c59b27 0%, #e0b642 100%)", fontSize: "1.4rem" }}
                  >
                    {(user?.Sname || user?.Uname || "A").charAt(0).toUpperCase()}
                  </div>
                  <h6 className="mb-0 font-weight-bold text-dark">{user?.Sname || "System Admin"}</h6>
                  <small className="text-muted">{user?.Email || "admin@sarbit.com"}</small>
                </div>

                <ul className="list-group list-group-flush" style={{ fontSize: "0.88rem" }}>
                  <li className="list-group-item px-0 py-2 d-flex justify-content-between align-items-center border-0">
                    <span className="text-muted"><i className="fa fa-id-badge mr-1"></i> Admin ID:</span>
                    <strong className="badge badge-light border">{user?.id || "N/A"}</strong>
                  </li>
                  <li className="list-group-item px-0 py-2 d-flex justify-content-between align-items-center border-0">
                    <span className="text-muted"><i className="fa fa-briefcase mr-1"></i> Role / Course:</span>
                    <span className="text-dark font-weight-bold">{user?.Cases || "Legal Administrator"}</span>
                  </li>
                  {user?.Phone && (
                    <li className="list-group-item px-0 py-2 d-flex justify-content-between align-items-center border-0">
                      <span className="text-muted"><i className="fa fa-phone mr-1"></i> Contact:</span>
                      <span className="text-dark">{user?.Phone}</span>
                    </li>
                  )}
                  {user?.Uname && (
                    <li className="list-group-item px-0 py-2 d-flex justify-content-between align-items-center border-0">
                      <span className="text-muted"><i className="fa fa-user mr-1"></i> Username:</span>
                      <span className="text-dark font-weight-bold">{user?.Uname}</span>
                    </li>
                  )}
                </ul>

                <div className="pt-3 mt-2 border-top d-flex">
                  <button 
                    type="button" 
                    className="btn btn-sm btn-outline-success flex-fill mr-2" 
                    onClick={handleEdit}
                    style={{ borderRadius: "6px" }}
                  >
                    <i className="fa fa-pencil mr-1"></i> Edit
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-sm btn-outline-danger flex-fill" 
                    onClick={handleDelete}
                    style={{ borderRadius: "6px" }}
                  >
                    <i className="fa fa-trash mr-1"></i> Delete
                  </button>
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS CARD */}
            <div className="card border-0 shadow-sm mt-3" style={{ borderRadius: "14px" }}>
              <div className="card-body p-3">
                <h6 className="font-weight-bold text-dark mb-2" style={{ fontSize: "0.9rem" }}>
                  <i className="fa fa-bolt text-warning mr-2"></i> Quick Actions
                </h6>
                <div className="d-grid gap-2">
                  <Link to="/AdminTeam" className="btn btn-light btn-sm btn-block text-left text-dark mb-2 border-0" style={{ backgroundColor: "#f8f9fa", borderRadius: "6px" }}>
                    <i className="fa fa-user-plus text-primary mr-2"></i> Add Team Member
                  </Link>
                  <Link to="/AdminCaseStudies" className="btn btn-light btn-sm btn-block text-left text-dark mb-2 border-0" style={{ backgroundColor: "#f8f9fa", borderRadius: "6px" }}>
                    <i className="fa fa-plus-circle text-success mr-2"></i> Add Case Category
                  </Link>
                  <Link to="/AdminOrders" className="btn btn-light btn-sm btn-block text-left text-dark mb-2 border-0" style={{ backgroundColor: "#f8f9fa", borderRadius: "6px" }}>
                    <i className="fa fa-file-pdf-o text-danger mr-2"></i> Upload Case Decree (PDF)
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: DASHBOARD STATS, COUNTS & CATEGORY-WISE BREAKDOWN */}
          <div className="col-xl-9 col-lg-8 col-md-12">
            
            {/* ======================================================== */}
            {/* 1. STATS / KPI COUNT CARDS ("count add kro") */}
            {/* ======================================================== */}
            <div className="row mb-4">
              
              {/* CARD 1: TEAM MEMBERS COUNT */}
              <div className="col-xl-4 col-md-6 mb-3">
                <div 
                  className="card border-0 shadow-sm h-100" 
                  style={{ 
                    borderRadius: "14px", 
                    background: "#ffffff",
                    borderBottom: "4px solid #3b82f6",
                    transition: "transform 0.2s"
                  }}
                >
                  <div className="card-body p-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-uppercase text-muted font-weight-bold" style={{ fontSize: "0.75rem", letterSpacing: "1px" }}>
                        Team Members
                      </span>
                      <div 
                        className="rounded-circle d-flex align-items-center justify-content-center text-white" 
                        style={{ width: "42px", height: "42px", backgroundColor: "#3b82f6" }}
                      >
                        <i className="fa fa-users"></i>
                      </div>
                    </div>
                    <h2 className="mb-1 font-weight-bold text-dark">
                      {loading ? "..." : stats.team_members_count}
                    </h2>
                    <p className="text-muted mb-3" style={{ fontSize: "0.82rem" }}>
                      Active Advocates & Legal Team
                    </p>
                    <Link 
                      to="/AdminTeam" 
                      className="d-flex align-items-center justify-content-between text-primary font-weight-bold text-decoration-none pt-2 border-top"
                      style={{ fontSize: "0.82rem" }}
                    >
                      <span>Manage Team</span>
                      <i className="fa fa-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>

              {/* CARD 2: TOTAL CASES COUNT */}
              <div className="col-xl-4 col-md-6 mb-3">
                <div 
                  className="card border-0 shadow-sm h-100" 
                  style={{ 
                    borderRadius: "14px", 
                    background: "#ffffff",
                    borderBottom: "4px solid #c59b27",
                    transition: "transform 0.2s"
                  }}
                >
                  <div className="card-body p-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-uppercase text-muted font-weight-bold" style={{ fontSize: "0.75rem", letterSpacing: "1px" }}>
                        Total Cases
                      </span>
                      <div 
                        className="rounded-circle d-flex align-items-center justify-content-center text-dark" 
                        style={{ width: "42px", height: "42px", backgroundColor: "#c59b27" }}
                      >
                        <i className="fa fa-balance-scale"></i>
                      </div>
                    </div>
                    <h2 className="mb-1 font-weight-bold text-dark">
                      {loading ? "..." : stats.total_cases_count}
                    </h2>
                    <p className="text-muted mb-3" style={{ fontSize: "0.82rem" }}>
                      {stats.categories_count} Studies + {stats.case_orders_count} Decrees
                    </p>
                    <Link 
                      to="/AdminOrders" 
                      className="d-flex align-items-center justify-content-between text-dark font-weight-bold text-decoration-none pt-2 border-top"
                      style={{ fontSize: "0.82rem", color: "#9a781b" }}
                    >
                      <span>View Orders (PDFs)</span>
                      <i className="fa fa-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>

              {/* CARD 3: CASE CATEGORIES COUNT */}
              <div className="col-xl-4 col-md-6 mb-3">
                <div 
                  className="card border-0 shadow-sm h-100" 
                  style={{ 
                    borderRadius: "14px", 
                    background: "#ffffff",
                    borderBottom: "4px solid #10b981",
                    transition: "transform 0.2s"
                  }}
                >
                  <div className="card-body p-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-uppercase text-muted font-weight-bold" style={{ fontSize: "0.75rem", letterSpacing: "1px" }}>
                        Case Categories
                      </span>
                      <div 
                        className="rounded-circle d-flex align-items-center justify-content-center text-white" 
                        style={{ width: "42px", height: "42px", backgroundColor: "#10b981" }}
                      >
                        <i className="fa fa-folder-open"></i>
                      </div>
                    </div>
                    <h2 className="mb-1 font-weight-bold text-dark">
                      {loading ? "..." : stats.categories_count}
                    </h2>
                    <p className="text-muted mb-3" style={{ fontSize: "0.82rem" }}>
                      Practice Areas & Disciplines
                    </p>
                    <Link 
                      to="/AdminCaseStudies" 
                      className="d-flex align-items-center justify-content-between text-success font-weight-bold text-decoration-none pt-2 border-top"
                      style={{ fontSize: "0.82rem" }}
                    >
                      <span>Manage Categories</span>
                      <i className="fa fa-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>

              {/* CARD 4: APPOINTMENTS COUNT */}
              <div className="col-xl-4 col-md-6 mb-3">
                <div 
                  className="card border-0 shadow-sm h-100" 
                  style={{ 
                    borderRadius: "14px", 
                    background: "#ffffff",
                    borderBottom: "4px solid #8b5cf6",
                    transition: "transform 0.2s"
                  }}
                >
                  <div className="card-body p-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-uppercase text-muted font-weight-bold" style={{ fontSize: "0.75rem", letterSpacing: "1px" }}>
                        Appointments
                      </span>
                      <div 
                        className="rounded-circle d-flex align-items-center justify-content-center text-white" 
                        style={{ width: "42px", height: "42px", backgroundColor: "#8b5cf6" }}
                      >
                        <i className="fa fa-calendar-check-o"></i>
                      </div>
                    </div>
                    <h2 className="mb-1 font-weight-bold text-dark">
                      {loading ? "..." : stats.appointments_count}
                    </h2>
                    <p className="text-muted mb-3" style={{ fontSize: "0.82rem" }}>
                      General Client Inquiries & Bookings
                    </p>
                    <Link 
                      to="/AdminAppointments" 
                      className="d-flex align-items-center justify-content-between font-weight-bold text-decoration-none pt-2 border-top"
                      style={{ fontSize: "0.82rem", color: "#8b5cf6" }}
                    >
                      <span>View Appointments</span>
                      <i className="fa fa-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>

              {/* CARD 5: CONSULTATION BOOKINGS */}
              <div className="col-xl-4 col-md-6 mb-3">
                <div 
                  className="card border-0 shadow-sm h-100" 
                  style={{ 
                    borderRadius: "14px", 
                    background: "#ffffff",
                    borderBottom: "4px solid #0284c7",
                    transition: "transform 0.2s"
                  }}
                >
                  <div className="card-body p-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-uppercase text-muted font-weight-bold" style={{ fontSize: "0.75rem", letterSpacing: "1px" }}>
                        Consultation Bookings
                      </span>
                      <div 
                        className="rounded-circle d-flex align-items-center justify-content-center text-white" 
                        style={{ width: "42px", height: "42px", backgroundColor: "#0284c7" }}
                      >
                        <i className="fa fa-handshake-o"></i>
                      </div>
                    </div>
                    <div className="d-flex align-items-baseline">
                      <h2 className="mb-1 font-weight-bold text-dark mr-2">
                        {loading ? "..." : stats.consultations_count}
                      </h2>
                      <span className="badge badge-success px-2 py-1" style={{ fontSize: "0.75rem" }}>
                        ₹{(parseFloat(stats.consultations_revenue) || 0).toLocaleString()} Paid
                      </span>
                    </div>
                    <p className="text-muted mb-3" style={{ fontSize: "0.82rem" }}>
                      Direct Website Consultation Passes
                    </p>
                    <Link 
                      to="/AdminConsultations" 
                      className="d-flex align-items-center justify-content-between font-weight-bold text-decoration-none pt-2 border-top"
                      style={{ fontSize: "0.82rem", color: "#0284c7" }}
                    >
                      <span>Manage Consultations</span>
                      <i className="fa fa-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>

            </div>

            {/* ======================================================== */}
            {/* 2. CATEGORY-WISE BREAKDOWN SECTION ("category wise bnao") */}
            {/* ======================================================== */}
            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "14px", overflow: "hidden" }}>
              <div 
                className="card-header border-0 py-3 bg-white d-flex flex-wrap align-items-center justify-content-between"
                style={{ borderBottom: "1px solid #edf2f7" }}
              >
                <div>
                  <h5 className="mb-0 font-weight-bold text-dark d-flex align-items-center">
                    <span 
                      className="d-inline-flex align-items-center justify-content-center rounded mr-2" 
                      style={{ width: "32px", height: "32px", backgroundColor: "rgba(197, 155, 39, 0.15)", color: "#c59b27" }}
                    >
                      <i className="fa fa-th-large"></i>
                    </span>
                    Category-Wise Cases Breakdown
                  </h5>
                  <small className="text-muted">
                    Total {stats.categories_count} Practice Categories configured in system
                  </small>
                </div>

                <div className="d-flex align-items-center mt-2 mt-md-0">
                  <div className="input-group input-group-sm mr-2" style={{ maxWidth: "230px" }}>
                    <div className="input-group-prepend">
                      <span className="input-group-text bg-light border-right-0"><i className="fa fa-search text-muted"></i></span>
                    </div>
                    <input 
                      type="text" 
                      className="form-control bg-light border-left-0" 
                      placeholder="Filter category..."
                      value={categorySearch}
                      onChange={(e) => setCategorySearch(e.target.value)}
                    />
                  </div>
                  <Link to="/AdminCaseStudies" className="btn btn-sm text-white" style={{ backgroundColor: "#c59b27", borderRadius: "6px" }}>
                    <i className="fa fa-plus-circle mr-1"></i> Add Category
                  </Link>
                </div>
              </div>

              <div className="card-body p-0">
                {loading ? (
                  <div className="text-center py-5">
                    <i className="fa fa-spinner fa-spin fa-2x text-muted mb-2"></i>
                    <p className="text-muted">Loading categories and counts...</p>
                  </div>
                ) : filteredCategories.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fa fa-folder-open-o fa-3x text-muted mb-2"></i>
                    <p className="text-muted">No categories found in database.</p>
                    <Link to="/AdminCaseStudies" className="btn btn-sm btn-outline-primary">
                      Create First Case Category
                    </Link>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0" style={{ fontSize: "0.9rem" }}>
                      <thead style={{ backgroundColor: "#f8fafc", color: "#475569", borderBottom: "2px solid #e2e8f0" }}>
                        <tr>
                          <th style={{ width: "70px" }}># ID</th>
                          <th>Category Name</th>
                          <th>Description</th>
                          <th className="text-center" style={{ width: "130px" }}>Related Orders</th>
                          <th className="text-center" style={{ width: "140px" }}>Inquiries</th>
                          <th style={{ width: "160px" }}>Distribution</th>
                          <th className="text-right" style={{ width: "120px" }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCategories.map((cat, index) => {
                          // Calculate share percentage for visual progress
                          const total = stats.total_cases_count || 1;
                          const count = cat.cases_count || 1;
                          const percent = Math.min(100, Math.round((count / total) * 100));

                          return (
                            <tr key={cat.category_id || index}>
                              <td>
                                <span className="badge badge-secondary" style={{ backgroundColor: "#e2e8f0", color: "#334155" }}>
                                  #{cat.category_id}
                                </span>
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  {cat.image_url ? (
                                    <img 
                                      src={getImageUrl(cat.image_url)} 
                                      alt={cat.category_name} 
                                      className="rounded mr-2" 
                                      style={{ width: "36px", height: "36px", objectFit: "cover" }}
                                      onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                  ) : (
                                    <div 
                                      className="rounded d-inline-flex align-items-center justify-content-center mr-2 text-warning font-weight-bold"
                                      style={{ width: "36px", height: "36px", backgroundColor: "#fffbeb", border: "1px solid #fef3c7" }}
                                    >
                                      <i className="fa fa-legal"></i>
                                    </div>
                                  )}
                                  <div>
                                    <strong className="text-dark d-block">{cat.category_name}</strong>
                                    {cat.parent_id && (
                                      <small className="text-muted">Parent ID: {cat.parent_id}</small>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td>
                                <p className="mb-0 text-muted" style={{ maxWidth: "260px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={cat.description}>
                                  {cat.description || "No description provided"}
                                </p>
                              </td>
                              <td className="text-center">
                                <span className="badge badge-pill badge-primary px-3 py-1 font-weight-bold" style={{ backgroundColor: "#2563eb" }}>
                                  {cat.cases_count || 0} Cases
                                </span>
                              </td>
                              <td className="text-center">
                                <span className="badge badge-pill badge-info px-3 py-1 font-weight-bold" style={{ backgroundColor: "#0284c7" }}>
                                  {cat.appointments_count || 0} Bookings
                                </span>
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="progress flex-grow-1 mr-2" style={{ height: "6px", backgroundColor: "#e2e8f0", borderRadius: "10px" }}>
                                    <div 
                                      className="progress-bar" 
                                      role="progressbar" 
                                      style={{ width: `${percent > 15 ? percent : 25}%`, backgroundColor: "#c59b27", borderRadius: "10px" }}
                                    ></div>
                                  </div>
                                  <small className="text-muted font-weight-bold">{percent > 15 ? percent : 25}%</small>
                                </div>
                              </td>
                              <td className="text-right">
                                <Link 
                                  to="/AdminCaseStudies" 
                                  className="btn btn-sm btn-outline-secondary"
                                  title="Manage this category"
                                  style={{ borderRadius: "6px" }}
                                >
                                  <i className="fa fa-external-link"></i> Manage
                                </Link>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div className="card-footer bg-light py-2 text-muted" style={{ fontSize: "0.82rem" }}>
                <div className="d-flex justify-content-between align-items-center flex-wrap">
                  <span>
                    <i className="fa fa-info-circle mr-1 text-primary"></i> 
                    Categories correspond directly to Practice Areas rendered on the Sarbit public portal.
                  </span>
                  <Link to="/AdminCaseStudies" className="text-dark font-weight-bold">
                    View All Categories in Table →
                  </Link>
                </div>
              </div>
            </div>

            {/* ======================================================== */}
            {/* 3. DUAL OVERVIEW: TEAM MEMBERS & RECENT CASE ORDERS */}
            {/* ======================================================== */}
            <div className="row">
              
              {/* TEAM MEMBERS QUICK CARD */}
              <div className="col-lg-6 mb-4">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "14px", overflow: "hidden" }}>
                  <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center" style={{ borderBottom: "1px solid #edf2f7" }}>
                    <h6 className="mb-0 font-weight-bold text-dark d-flex align-items-center">
                      <i className="fa fa-users text-primary mr-2"></i> Team Members List ({stats.team_members_count})
                    </h6>
                    <Link to="/AdminTeam" className="btn btn-sm btn-outline-primary" style={{ borderRadius: "6px" }}>
                      <i className="fa fa-plus mr-1"></i> Add Member
                    </Link>
                  </div>
                  <div className="card-body p-0">
                    {stats.team_members.length === 0 ? (
                      <div className="p-4 text-center text-muted">
                        <i className="fa fa-user-times fa-2x mb-2 text-muted"></i>
                        <p className="mb-1">No team members loaded yet.</p>
                        <Link to="/AdminTeam" className="btn btn-sm btn-primary">Go to Team Management</Link>
                      </div>
                    ) : (
                      <div className="list-group list-group-flush">
                        {stats.team_members.slice(0, 5).map((m) => (
                          <div key={m.id} className="list-group-item d-flex align-items-center justify-content-between py-2 px-3 border-0">
                            <div className="d-flex align-items-center">
                              {m.image_url ? (
                                <img 
                                  src={getImageUrl(m.image_url)} 
                                  alt={m.name} 
                                  className="rounded-circle mr-3" 
                                  style={{ width: "40px", height: "40px", objectFit: "cover" }}
                                  onError={(e) => { e.target.style.display = 'none'; }}
                                />
                              ) : (
                                <div 
                                  className="rounded-circle d-flex align-items-center justify-content-center mr-3 text-white font-weight-bold" 
                                  style={{ width: "40px", height: "40px", backgroundColor: "#3b82f6" }}
                                >
                                  {(m.name || "T").charAt(0)}
                                </div>
                              )}
                              <div>
                                <strong className="text-dark d-block" style={{ fontSize: "0.92rem" }}>{m.name}</strong>
                                <small className="text-muted">{m.role || "Advocate"}</small>
                              </div>
                            </div>
                            <span className="badge badge-light border text-muted px-2 py-1">
                              ID #{m.id}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="card-footer bg-white border-0 py-2 text-center">
                    <Link to="/AdminTeam" className="text-primary font-weight-bold" style={{ fontSize: "0.85rem" }}>
                      View All {stats.team_members_count} Team Members →
                    </Link>
                  </div>
                </div>
              </div>

              {/* RECENT CASE ORDERS (PDFS) */}
              <div className="col-lg-6 mb-4">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "14px", overflow: "hidden" }}>
                  <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center" style={{ borderBottom: "1px solid #edf2f7" }}>
                    <h6 className="mb-0 font-weight-bold text-dark d-flex align-items-center">
                      <i className="fa fa-file-pdf-o text-danger mr-2"></i> Case Orders & Decrees ({stats.case_orders_count})
                    </h6>
                    <Link to="/AdminOrders" className="btn btn-sm btn-outline-danger" style={{ borderRadius: "6px" }}>
                      <i className="fa fa-upload mr-1"></i> Upload Order
                    </Link>
                  </div>
                  <div className="card-body p-0">
                    {stats.recent_orders.length === 0 ? (
                      <div className="p-4 text-center text-muted">
                        <i className="fa fa-file-text-o fa-2x mb-2 text-muted"></i>
                        <p className="mb-1">No case orders uploaded yet.</p>
                        <Link to="/AdminOrders" className="btn btn-sm btn-danger">Upload Case Order</Link>
                      </div>
                    ) : (
                      <div className="list-group list-group-flush">
                        {stats.recent_orders.map((order) => (
                          <div key={order.id} className="list-group-item d-flex align-items-center justify-content-between py-2 px-3 border-0">
                            <div className="d-flex align-items-center" style={{ maxWidth: "75%" }}>
                              <div 
                                className="rounded d-flex align-items-center justify-content-center mr-3 text-danger" 
                                style={{ width: "36px", height: "36px", backgroundColor: "#fee2e2" }}
                              >
                                <i className="fa fa-file-pdf-o"></i>
                              </div>
                              <div style={{ overflow: "hidden" }}>
                                <strong className="text-dark d-block text-truncate" style={{ fontSize: "0.9rem" }}>
                                  {order.case_title || "Court Decree Order"}
                                </strong>
                                <small className="text-muted d-block text-truncate">
                                  {order.name || "Advocate / Court"}
                                </small>
                              </div>
                            </div>
                            <div>
                              {order.pdf_url ? (
                                <a 
                                  href={getPdfUrl(order.pdf_url)} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  className="btn btn-sm btn-outline-danger"
                                  style={{ borderRadius: "6px", fontSize: "0.78rem" }}
                                >
                                  PDF
                                </a>
                              ) : (
                                <span className="badge badge-light border">No PDF</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="card-footer bg-white border-0 py-2 text-center">
                    <Link to="/AdminOrders" className="text-danger font-weight-bold" style={{ fontSize: "0.85rem" }}>
                      Manage All {stats.case_orders_count} Case Orders →
                    </Link>
                  </div>
                </div>
              </div>

            </div>

            {/* ======================================================== */}
            {/* 4. RECENT CONSULTATION BOOKINGS (PAID CLIENTS) */}
            {/* ======================================================== */}
            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "14px", overflow: "hidden" }}>
              <div 
                className="card-header border-0 py-3 bg-white d-flex flex-wrap align-items-center justify-content-between"
                style={{ borderBottom: "1px solid #edf2f7" }}
              >
                <div>
                  <h6 className="mb-0 font-weight-bold text-dark d-flex align-items-center">
                    <i className="fa fa-handshake-o text-primary mr-2" style={{ fontSize: "1.1rem" }}></i> 
                    Recent Consultation Bookings ({stats.consultations_count})
                  </h6>
                  <small className="text-muted">Direct paid client sessions booked through the consultation portal</small>
                </div>
                <div className="d-flex align-items-center mt-2 mt-sm-0">
                  <span className="badge badge-success px-2 py-1 mr-3" style={{ fontSize: "0.82rem" }}>
                    Total Collected: ₹{(parseFloat(stats.consultations_revenue) || 0).toLocaleString()}
                  </span>
                  <Link 
                    to="/AdminConsultations" 
                    className="btn btn-sm btn-primary"
                    style={{ borderRadius: "6px" }}
                  >
                    Manage All Consultations →
                  </Link>
                </div>
              </div>

              <div className="card-body p-0">
                {stats.recent_consultations.length === 0 ? (
                  <div className="p-4 text-center text-muted">
                    <i className="fa fa-calendar-o fa-2x mb-2 text-muted"></i>
                    <p className="mb-0">No consultation bookings recorded yet.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover mb-0" style={{ fontSize: "0.88rem" }}>
                      <thead className="thead-light">
                        <tr>
                          <th>Token</th>
                          <th>Client Name & Phone</th>
                          <th>Case Discipline</th>
                          <th>Slot Time & Date</th>
                          <th>Fee</th>
                          <th>Payment</th>
                          <th>Status</th>
                          <th className="text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.recent_consultations.map((b) => (
                          <tr key={b.id}>
                            <td>
                              <span className="badge badge-dark p-1" style={{ fontFamily: "monospace" }}>
                                {b.booking_token}
                              </span>
                            </td>
                            <td>
                              <strong>{b.name}</strong>
                              <small className="d-block text-muted">{b.mobile}</small>
                            </td>
                            <td>
                              <span className="badge badge-info">{b.case_type}</span>
                            </td>
                            <td>
                              <strong>{b.consultation_date ? new Date(b.consultation_date).toLocaleDateString() : "-"}</strong>
                              <small className="d-block text-muted">{b.time_slot}</small>
                            </td>
                            <td>
                              <strong className="text-success">₹{parseFloat(b.fee || 5000).toLocaleString()}</strong>
                            </td>
                            <td>
                              <span className={`badge ${b.payment_status === "paid" ? "badge-success" : "badge-warning"}`}>
                                {b.payment_status || "paid"}
                              </span>
                            </td>
                            <td>
                              <span className={`badge ${b.booking_status === "confirmed" ? "badge-success" : "badge-secondary"}`}>
                                {b.booking_status || "confirmed"}
                              </span>
                            </td>
                            <td className="text-right">
                              <Link to="/AdminConsultations" className="btn btn-sm btn-outline-primary" style={{ fontSize: "0.78rem" }}>
                                Details
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;
