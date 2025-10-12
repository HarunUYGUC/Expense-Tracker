import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import UserAvatar from '../assets/user-avatar.jpg';

function Navbar() {
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

          <div className="d-flex align-items-center navbar-icons">
             <a href="#" className="nav-link text-secondary me-3">
                <FaBell />
             </a>
             <img src={UserAvatar} alt="User Avatar" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;