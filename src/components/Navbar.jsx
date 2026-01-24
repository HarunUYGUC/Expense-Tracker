import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FaBell, FaUserCircle } from 'react-icons/fa'; // Sadece gerekli ikonlar
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

function Navbar() {
  const { user, logout } = useAuth();
  const { theme } = useTheme();

  return (
    <nav 
      className={`navbar navbar-expand-lg border-bottom ${theme === 'dark' ? 'navbar-dark' : 'navbar-light'}`}
      style={{ backgroundColor: 'var(--bs-tertiary-bg)' }}
    >
      <div className="container-fluid px-4">
        
        {/* Marka (Logo) */}
        <Link className="navbar-brand fw-bold" to="/">Expense Tracker</Link>

        {/* Mobil Toggler */}
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

        {/* Çökebilir İçerik */}
        <div className="collapse navbar-collapse" id="mainNavbar">

          {/* Sayfa Linkleri */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-5 gap-1"> 
            <li className="nav-item">
              <NavLink className="nav-link nav-link-animated" to="/dashboard">Dashboard</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link nav-link-animated" to="/receipts">Receipts</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link nav-link-animated" to="/texts">Texts</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link nav-link-animated" to="/products">Products</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link nav-link-animated" to="/stores">Stores</NavLink>
            </li>
          </ul>

          {/* Sağ Taraf (Kullanıcı İşlemleri) */}
          <div className="d-flex align-items-center mt-3 mt-lg-0">
            {user ? (
              // KULLANICI GİRİŞ YAPMIŞSA
              <>
                <label className="notification-bell" title="Notifications">
                  <input type="checkbox" />
                    {/* Bell Regular (Boş Zil) */}
                    <svg className="bell-regular" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                      <path d="M224 0c-17.7 0-32 14.3-32 32V49.9C119.5 61.4 64 124.2 64 200v33.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416H424c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4V200c0-75.8-55.5-138.6-128-150.1V32c0-17.7-14.3-32-32-32zm0 96h8c57.4 0 104 46.6 104 104v33.4c0 47.9 13.9 94.6 39.7 134.6H72.3C98.1 328 112 281.3 112 233.4V200c0-57.4 46.6-104 104-104h8zm64 352H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z"></path>
                    </svg>
                    {/* Bell Solid (Dolu Zil - Tıklanınca gelir) */}
                    <svg className="bell-solid" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                      <path d="M224 0c-17.7 0-32 14.3-32 32V51.2C119 66 64 130.6 64 208v18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416H416c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z"></path>
                    </svg>
                </label>
                
                {/* Kullanıcı Bilgisi */}
                <div className="d-flex align-items-center me-3">
                    <span className="navbar-text me-2 fw-medium" style={{ fontSize: '0.9rem' }}>
                    {user.email}
                    </span>
                    <FaUserCircle className="fs-4 text-secondary" title={`Logged in as ${user.email}`} />
                </div>

                {/* LOGOUT BUTONU */}
                <button className="logout-btn" onClick={logout} title="Logout">
                  <div className="logout-sign">
                    <svg viewBox="0 0 512 512">
                      <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
                    </svg>
                  </div>
                  <div className="logout-text">Logout</div>
                </button>
              </>
            ) : (
              // GİRİŞ YAPMAMIŞSA
              <div className="d-flex align-items-center gap-3">
                
                {/* LOGIN BUTONU */}
                <Link 
                  to="/login" 
                  className="user-profile" 
                  aria-label="User Login Button"
                  role="button"
                >
                  <div className="user-profile-inner">
                    <svg
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <g data-name="Layer 2" id="Layer_2">
                        <path
                          d="m15.626 11.769a6 6 0 1 0 -7.252 0 9.008 9.008 0 0 0 -5.374 8.231 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 9.008 9.008 0 0 0 -5.374-8.231zm-7.626-4.769a4 4 0 1 1 4 4 4 4 0 0 1 -4-4zm10 14h-12a1 1 0 0 1 -1-1 7 7 0 0 1 14 0 1 1 0 0 1 -1 1z"
                        ></path>
                      </g>
                    </svg>
                    <p>Log In</p>
                  </div>
                </Link>

                {/* SIGN UP BUTONU */}
                <Link 
                  to="/signup" 
                  className="user-profile-primary"
                  role="button"
                >
                  Sign Up
                </Link>

              </div>
            )}
          </div>
        </div> 
      </div>
    </nav>
  );
}

export default Navbar;