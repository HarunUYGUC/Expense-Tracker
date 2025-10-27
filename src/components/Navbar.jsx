import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom">
      <div className="container-fluid px-4">
        
        {/* Marka */}
        <Link className="navbar-brand fw-bold" to="/">Expense Tracker</Link>

        {/* MOBİL TOGGLER (HAMBURGER) BUTONU */}
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* COLLAPSIBLE WRAPPER */}
        <div className="collapse navbar-collapse" id="mainNavbar">
          
          {/* Sayfa Linkleri */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-5">
            <li className="nav-item">
              <NavLink className="nav-link" to="/dashboard">Dashboard</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/receipts">Receipts</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/products">Products</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/stores">Stores</NavLink>
            </li>
          </ul>

          {/*  Log In, Sign Up Bölümü */}
          <div className="d-flex align-items-center mt-3 mt-lg-0">
            {user ? (
              <>
                <a href="#" className="nav-link text-secondary me-3" style={{ fontSize: '1.2rem' }}>
                  <FaBell />
                </a>
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  style={{ width: '32px', height: '32px', borderRadius: '50%' }} 
                  title={`Logged in as ${user.name}`}
                />
                <button 
                  onClick={logout} 
                  className="btn btn-link text-decoration-none ms-2 nav-link-logout"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="d-grid gap-2 d-lg-flex">
                <Link 
                  to="/login" 
                  className="btn btn-login-style nav-link-login"
                >
                  Log In
                </Link>
                <Link to="/signup" className="btn btn-primary">Sign Up</Link>
              </div>
            )}
          </div>
        </div> 
        {/* Wrapper Bitişi */}
      </div>
    </nav>
  );
}

export default Navbar;