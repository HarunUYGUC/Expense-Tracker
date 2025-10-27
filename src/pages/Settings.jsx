import React from 'react';
import { useTheme } from '../context/ThemeContext';

function Settings() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="container-fluid px-4 py-4" style={{ backgroundColor: 'var(--bs-body-bg)' }}>
      <h1 className="display-6 fw-bold mb-4">Settings</h1>

      {/* Görünüm Ayarları Kartı */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <h5 className="card-title mb-3">Appearance</h5>
          
          <div className="form-check form-switch fs-5">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="darkModeToggle"
              checked={theme === 'dark'} 
              onChange={toggleTheme} 
            />
            <label className="form-check-label" htmlFor="darkModeToggle">
              Dark Mode
            </label>
          </div>
          <p className="text-muted small mt-2">
            Toggle to switch between light and dark themes.
          </p>
        </div>
      </div>

      {/* İleride buraya başka ayarlar eklenecek */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <h5 className="card-title mb-3">Account</h5>
          <p className="text-muted">More account settings will be available here soon.</p>
        </div>
      </div>

    </div>
  );
}

export default Settings;