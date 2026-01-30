import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { FaGlobe, FaPalette, FaUserCog, FaWallet, FaSave } from 'react-icons/fa';

function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { currency, updateCurrency } = useCurrency();
  const { user } = useAuth();

  // Bütçe State'i
  const [budgetInput, setBudgetInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Sayfa yüklendiğinde mevcut bütçeyi çek
  useEffect(() => {
    if (user) {
      const fetchBudget = async () => {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists() && docSnap.data().budgetLimit) {
            setBudgetInput(docSnap.data().budgetLimit);
          }
        } catch (error) {
          console.error("Error fetching budget:", error);
        }
      };
      fetchBudget();
    }
  }, [user]);

  // Bütçeyi Kaydet
  const handleSaveBudget = async () => {
    if (!user) return;
    setSaving(true);
    setMessage('');

    try {
      // Users koleksiyonuna bütçeyi kaydet (Merge: true ile diğer verileri silmez)
      await setDoc(doc(db, "users", user.uid), {
        budgetLimit: parseFloat(budgetInput) || 0
      }, { merge: true });
      
      setMessage('Budget updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error("Error saving budget:", error);
      setMessage('Failed to save budget.');
    } finally {
      setSaving(false);
    }
  };

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

            {/* BÜTÇE HEDEFLERİ */}
            <div className="col-md-6">
                <div className="card border-0 shadow-sm h-100">
                    <div className="card-body p-4">
                        <div className="d-flex align-items-center mb-4">
                            <div className="bg-success-subtle text-success p-2 rounded me-3">
                                <FaWallet className="fs-5" />
                            </div>
                            <h5 className="card-title mb-0 fw-bold">Budget Goals</h5>
                        </div>

                        <div className="mb-3">
                            <label className="form-label text-muted small fw-bold">MONTHLY LIMIT ({currency.symbol})</label>
                            <div className="input-group input-group-lg">
                                <span className="input-group-text bg-body-tertiary">{currency.symbol}</span>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    placeholder="e.g. 5000"
                                    value={budgetInput}
                                    onChange={(e) => setBudgetInput(e.target.value)}
                                />
                                <button 
                                    className="btn btn-primary" 
                                    onClick={handleSaveBudget}
                                    disabled={saving}
                                >
                                    {saving ? '...' : <FaSave />}
                                </button>
                            </div>
                            <div className="form-text mt-2">
                                Set a monthly spending limit to track your progress on the dashboard.
                            </div>
                            {message && <div className={`mt-2 small fw-bold ${message.includes('Failed') ? 'text-danger' : 'text-success'}`}>{message}</div>}
                        </div>
                    </div>
                </div>
            </div>

            {/* GÖRÜNÜM (Karanlık Mod) */}
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
                            
                            <div className="switch-container">
                                <input
                                    type="checkbox"
                                    id="darkModeToggle"
                                    className="switch-input"
                                    checked={theme === 'dark'} 
                                    onChange={toggleTheme} 
                                />
                                <label htmlFor="darkModeToggle" className="switch-label"></label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* HESAP */}
            <div className="col-md-6">
                <div className="card border-0 shadow-sm h-100">
                    <div className="card-body p-4">
                        <div className="d-flex align-items-center mb-3">
                            <div className="bg-secondary-subtle text-secondary p-2 rounded me-3">
                                <FaUserCog className="fs-5" />
                            </div>
                            <h5 className="card-title mb-0 fw-bold">Account</h5>
                        </div>
                        <p className="text-muted mb-0">Account: <strong>{user?.email}</strong></p>
                        <p className="text-muted small mt-1">More settings coming soon.</p>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}

export default Settings;