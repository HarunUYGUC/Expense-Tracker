import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext'; 
import { useAuth } from '../context/AuthContext'; 
import { db } from '../firebase'; 
import { doc, getDoc, setDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore'; 
import { FaGlobe, FaPalette, FaUserCog, FaWallet, FaSave, FaTrashRestore, FaExclamationTriangle } from 'react-icons/fa'; 

function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { currency, updateCurrency } = useCurrency(); 
  const { user } = useAuth();

  // Bütçe State'i
  const [budgetInput, setBudgetInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Veri Sıfırlama State'i
  const [resetting, setResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState('');

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

  // Bütçeyi Kaydetme
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

  // VERİ SIFIRLAMA FONKSİYONU
  const handleResetData = async () => {
    if (!user) return;

    // Onay İste
    if (!window.confirm("ARE YOU SURE? \n\nThis will permanently delete ALL your scanned receipts and manual entries. This action cannot be undone.")) {
      return;
    }

    setResetting(true);
    setResetMessage('');

    try {
      // Kullanıcıya ait tüm fişleri bul
      const q = query(collection(db, "receipts"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);

      // Hepsini sil (Promise.all ile paralel silme)
      const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      // Bütçe ayarını da sıfırla
      // await setDoc(doc(db, "users", user.uid), { budgetLimit: 0 }, { merge: true });
      // setBudgetInput('');

      setResetMessage('All data has been successfully deleted.');
      
      // Mesajı temizle
      setTimeout(() => setResetMessage(''), 5000);

    } catch (error) {
      console.error("Error resetting data:", error);
      setResetMessage('Failed to reset data. Please try again.');
    } finally {
      setResetting(false);
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

            {/* Bütçe Hedefleri */}
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

            {/* Görünüm */}
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

            {/* Hesap Yönetimi */}
            <div className="col-md-6">
                <div className="card border-0 shadow-sm h-100">
                    <div className="card-body p-4">
                        <div className="d-flex align-items-center mb-4">
                            <div className="bg-secondary-subtle text-secondary p-2 rounded me-3">
                                <FaUserCog className="fs-5" />
                            </div>
                            <h5 className="card-title mb-0 fw-bold">Account Management</h5>
                        </div>
                        
                        <div className="mb-4">
                            <p className="text-muted mb-1 small fw-bold">LOGGED IN AS</p>
                            <p className="fw-medium fs-5">{user?.email}</p>
                        </div>

                        <hr className="my-4"/>

                        <div>
                            <p className="text-danger fw-bold small d-flex align-items-center">
                                <FaExclamationTriangle className="me-2" /> DANGER ZONE
                            </p>
                            <p className="text-muted small mb-3">
                                This will permanently delete all your scanned receipts and manual entries. Your account will remain active.
                            </p>
                            <button 
                                className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center"
                                onClick={handleResetData}
                                disabled={resetting}
                            >
                                {resetting ? (
                                    <>Processing...</>
                                ) : (
                                    <>
                                        <FaTrashRestore className="me-2" /> Reset All Data
                                    </>
                                )}
                            </button>
                            {resetMessage && <div className="mt-2 text-center small fw-bold text-success">{resetMessage}</div>}
                        </div>

                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}

export default Settings;