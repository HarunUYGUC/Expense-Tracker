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
          
          <div className="d-flex justify-content-between align-items-center mb-3">
             <h5 className="card-title mb-0">Appearance</h5>
             {/* Durumu metin olarak göstermek isterseniz (Opsiyonel) */}
             <span className="badge bg-secondary">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
          </div>
          
          {/* ÖZEL BUTON BAŞLANGIÇ */}
          <div className="switch-container">
            <input
              type="checkbox"
              id="darkModeToggle"
              className="switch-input"
              checked={theme === 'dark'} 
              onChange={toggleTheme} 
            />
            <label htmlFor="darkModeToggle" className="switch-label">
              {/* İçerik boş, CSS ::before ile dolduruluyor */}
            </label>
          </div>
          {/* ÖZEL BUTON BİTİŞ */}

          <p className="text-muted small mt-3">
            Toggle to switch between light and dark themes.
          </p>
        </div>
      </div>

      {/* Account Ayarları (Aynen Kalıyor) */}
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