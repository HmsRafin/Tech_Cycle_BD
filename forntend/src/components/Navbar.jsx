import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          TechCycle BD
        </div>

        <div className="nav-toggle" onClick={toggleMenu}>
          {isOpen ? "✕" : "☰"}
        </div>

        <div className={`nav-links ${isOpen ? "mobile-active" : ""}`}>
          <Link 
            className={location.pathname === "/" ? "active" : ""} 
            to="/" 
            onClick={closeMenu}>
            Home
          </Link>

          <Link 
            className={location.pathname === "/about" ? "active" : ""} 
            to="/about" 
            onClick={closeMenu}>
            About
          </Link>
          <Link 
            className={location.pathname === "/services" ? "active" : ""} 
            to="/services" 
            onClick={closeMenu}>
            Services
          </Link>
          <Link 
            className={location.pathname === "/contact" ? "active" : ""} 
            to="/contact" 
            onClick={closeMenu}>
            Contact
          </Link>

          {user ? (
            <>
              <Link 
                className={location.pathname.includes("dashboard") ? "active login-btn" : "login-btn"} 
                to={user.role === "admin" ? "/admin-dashboard" : "/dashboard"}
                onClick={closeMenu}>
                Dashboard
              </Link>
              <button className="admin-btn" onClick={() => { handleLogout(); closeMenu(); }}>Logout</button>
            </>
          ) : (
            <>
              <Link 
                className={location.pathname === "/user-login" ? "active login-btn" : "login-btn"} 
                to="/user-login"
                onClick={closeMenu}>
                User Login
              </Link>

              <Link 
                className={location.pathname === "/admin-login" ? "active admin-btn" : "admin-btn"} 
                to="/admin-login"
                onClick={closeMenu}>
                Admin Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;