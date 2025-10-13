import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom">
      <div className="container-fluid px-4">
        <Link className="navbar-brand fw-bold" to="/">Expense Tracker</Link>
        
        <div className="collapse navbar-collapse ms-5">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
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

          <div className="d-flex align-items-center">
            {user ? (
              // KULLANICI GİRİŞ YAPMIŞSA
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
              // KULLANICI GİRİŞ YAPMAMIŞSA
              <div className="d-flex gap-2">
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
      </div>
    </nav>
  );
}

export default Navbar;