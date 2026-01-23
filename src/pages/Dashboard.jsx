import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit } from 'react-icons/fa';
import { dashboardData } from '../data/dashboardData';
import ImageModal from '../components/ImageModal';
import ReceiptDetailModal from '../components/ReceiptDetailModal'; 
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, orderBy, limit } from "firebase/firestore";

function Dashboard() {
  const { user } = useAuth();
  
  const [recentScans, setRecentScans] = useState([]);
  const [loadingScans, setLoadingScans] = useState(true);
  
  // RESİM MODALI STATE'LERİ
  const [isImageModalShowing, setIsImageModalShowing] = useState(false);
  const [selectedImage, setSelectedImage] = useState({ url: '', alt: '' });

  // DETAY MODALI STATE'LERİ
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  
  // Veri Çekme
  useEffect(() => {
    setLoadingScans(true);
    if (user) {
      const q = query(
        collection(db, "receipts"), 
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc"),
        limit(3) 
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const scansData = [];
        querySnapshot.forEach((doc) => {
          scansData.push({ id: doc.id, ...doc.data() });
        });
        setRecentScans(scansData);
        setLoadingScans(false);
      }, (error) => { 
        console.error("Error fetching recent scans: ", error);
        setLoadingScans(false);
      });

      return () => unsubscribe();
    } else {
      setRecentScans([]);
      setLoadingScans(false);
    }
  }, [user]); 

  // RESİM MODALI FONKSİYONLARI
  const openImageModal = (imageUrl, imageAlt) => {
    setSelectedImage({ url: imageUrl, alt: imageAlt });
    setIsImageModalShowing(true);
  };

  const closeImageModal = () => {
    setIsImageModalShowing(false);
    setSelectedImage({ url: '', alt: '' });
  };

  // DETAY MODALI FONKSİYONLARI
  const openDetailModal = (receipt) => {
    setSelectedReceipt(receipt);
    setShowDetailModal(true);
  };

  // GENEL TIKLAMA YÖNETİCİSİ
  const handleCardClick = (scan) => {
    if (scan.isManual) {
      // Manuel girişse Detay Modalını aç
      openDetailModal(scan);
    } else {
      // Resimse Resim Modalını aç
      openImageModal(scan.imageUrl, scan.fileName);
    }
  };
  
  return (
    <div className="dashboard-page-wrapper p-4">
      
      {/* Blur efekti her iki modal için de geçerli olsun */}
      <div 
        className={`dashboard-content-wrapper ${isImageModalShowing || showDetailModal ? 'content-blurred' : ''}`}
        style={{ transition: 'filter 0.3s ease-in-out' }} 
      >
        
        {/* BAŞLIK BÖLÜMÜ */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="display-6 fw-bold">Dashboard</h1>
          <div className="d-flex flex-column flex-sm-row gap-2">
             <Link to="/texts" className="btn btn-pulse btn-pulse-secondary px-4 py-2">
                <FaEdit className="me-2" /> New Text
             </Link>
             <Link to="/receipts" className="btn btn-pulse btn-pulse-primary px-4 py-2">
                <FaPlus className="me-2" /> New Scan
             </Link>
          </div>
        </div>

        {/* RECENT SCANS BÖLÜMÜ */}
        <h3 className="h5 mb-3">Recent Scans</h3>
        <div className="row mb-4">
          
          {loadingScans && (
            <div className="col-12 text-center p-5">
              <div className="spinner-border" role="status"></div>
            </div>
          )}

          {!user && !loadingScans && (
            <div className="col-12">
              <div className="card shadow-sm">
                <div className="card-body p-5 text-center">
                  <h5 className="text-muted">
                    <Link to="/login">Log in</Link> to see your data.
                  </h5>
                </div>
              </div>
            </div>
          )}
          
          {user && !loadingScans && recentScans.length === 0 && (
             <div className="col-12">
              <div className="card shadow-sm">
                <div className="card-body p-5 text-center">
                  <h5 className="text-muted">No recent scans found.</h5>
                  <p className="text-muted mb-0">Go to <Link to="/receipts">Receipts</Link> to upload or <Link to="/texts">Texts</Link> to enter data manually!</p>
                </div>
              </div>
            </div>
          )}

          {/* VERİ LİSTELEME */}
          {user && !loadingScans && recentScans.map(scan => (
            <div key={scan.id} className="col-lg-4 col-md-6 mb-4">
              <div 
                className="card border-0 shadow-sm h-100"
                style={{ cursor: 'pointer' }}
                onClick={() => handleCardClick(scan)} 
              >
                {/* Resim varsa göster, yoksa ikon göster */}
                {scan.imageUrl ? (
                    <img 
                      src={scan.imageUrl} 
                      className="card-img-top" 
                      alt={scan.fileName} 
                      style={{ height: '200px', objectFit: 'cover' }} 
                      onError={(e) => { e.target.src = 'https://placehold.co/600x400?text=No+Image'; }}
                    />
                ) : (
                    <div className="card-img-top d-flex align-items-center justify-content-center bg-body-tertiary text-muted" style={{ height: '200px' }}>
                        <span className="fs-1">📝</span>
                    </div>
                )}
                
                <div className="card-body">
                  <h6 className="card-title text-truncate" title={scan.fileName}>{scan.fileName}</h6>
                  <p className="card-text text-muted">${Number(scan.price).toFixed(2)}</p>
                  
                  {scan.isManual && <span className="badge bg-secondary me-1">Manual</span>}
                  {!scan.isManual && <span className="badge bg-info text-dark">Scanned</span>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* QUICK LINKS BÖLÜMÜ */}
        <h3 className="h5 mb-3">Quick Links</h3>
        <div className="row mb-4">
          {dashboardData.quickLinks.map(link => (
            <div key={link.id} className="col-lg-4 col-md-6 mb-4">
              <Link to={link.to} className="text-decoration-none text-dark">
                <div className="card border-0 shadow-sm p-3 quick-link-card">
                  <div className="d-flex align-items-center">
                    <div className="quick-link-icon me-3">
                      <link.icon />
                    </div>
                    <span className="fw-bold">{link.title}</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* MONTHLY SPENDING BÖLÜMÜ */}
        <h3 className="h5 mb-3">Monthly Spending</h3>
        <div className="row">
          {dashboardData.monthlySpending.map(stat => (
            <div key={stat.id} className="col-lg-4 col-md-6 mb-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h6 className="text-muted">{stat.title}</h6>
                  <h2 className="display-6 fw-bold">
                    {stat.isCurrency && '$'}
                    {stat.value.toLocaleString(undefined, { 
                      minimumFractionDigits: stat.isCurrency ? 2 : 0 
                    })}
                  </h2>
                </div>
              </div>
            </div>
          ))}
        </div>
      
      </div> 

      {/* Resim Modalı */}
      <ImageModal
        isShowing={isImageModalShowing}
        onClose={closeImageModal}
        imageUrl={selectedImage.url}
        imageAlt={selectedImage.alt}
      />

      {/* Detay Modalı (Manuel Girişler İçin) */}
      <ReceiptDetailModal 
        show={showDetailModal} 
        onClose={() => setShowDetailModal(false)} 
        receipt={selectedReceipt} 
      />

    </div>
  );
}

export default Dashboard;