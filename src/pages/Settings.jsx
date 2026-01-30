import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';
import { FaGlobe, FaPalette, FaUserCog } from 'react-icons/fa';

function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { currency, updateCurrency } = useCurrency();

  return (
    <div className="dashboard-page-wrapper p-4">
      <div className="container-fluid">
        <h1 className="display-6 fw-bold mb-4">Settings</h1>

        <div className="row g-4">
            
            {/* Para Birimi Seçimi */}
            <div className="col-md-6">
                <div className="card border-0 shadow-sm h-100">
                    <div className="card-body p-4">
                        <div className="d-flex align-items-center mb-4">
                            <div className="bg-primary-subtle text-primary p-2 rounded me-3">
                                <FaGlobe className="fs-5" />
                            </div>
                            <h5 className="card-title mb-0 fw-bold">Preferences</h5>
                        </div>

                        <div className="mb-3">
                            <label className="form-label text-muted small fw-bold">CURRENCY</label>
                            <select 
                                className="form-select form-select-lg" 
                                value={currency.code} 
                                onChange={(e) => updateCurrency(e.target.value)}
                                style={{ cursor: 'pointer' }}
                            >
                                <option value="USD">USD ($) - US Dollar</option>
                                <option value="EUR">EUR (€) - Euro</option>
                                <option value="TRY">TRY (₺) - Turkish Lira</option>
                                <option value="GBP">GBP (£) - British Pound</option>
                                <option value="JPY">JPY (¥) - Japanese Yen</option>
                            </select>
                            <div className="form-text mt-2">
                                Used for all price displays across the app.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Karanlık Mod */}
            <div className="col-md-6">
                <div className="card border-0 shadow-sm h-100">
                    <div className="card-body p-4">
                        <div className="d-flex align-items-center mb-4">
                            <div className="bg-warning-subtle text-warning-emphasis p-2 rounded me-3">
                                <FaPalette className="fs-5" />
                            </div>
                            <h5 className="card-title mb-0 fw-bold">Appearance</h5>
                        </div>

                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <span className="d-block fw-medium">Dark Mode</span>
                                <small className="text-muted">Switch between light and dark themes.</small>
                            </div>
                            
                            {/* Özel Animasyonlu Switch Butonu */}
                            <div className="switch-container">
                                <input
                                    type="checkbox"
                                    id="darkModeToggle"
                                    className="switch-input"
                                    checked={theme === 'dark'} 
                                    onChange={toggleTheme} 
                                />
                                <label htmlFor="darkModeToggle" className="switch-label">
                                    {/* CSS ::before ile dolduruluyor */}
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gelecek Özellikler İçin */}
            <div className="col-12">
                <div className="card border-0 shadow-sm">
                    <div className="card-body p-4">
                        <div className="d-flex align-items-center mb-3">
                            <div className="bg-secondary-subtle text-secondary p-2 rounded me-3">
                                <FaUserCog className="fs-5" />
                            </div>
                            <h5 className="card-title mb-0 fw-bold">Account</h5>
                        </div>
                        <p className="text-muted mb-0">Account management settings will be available here soon.</p>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}

export default Settings;