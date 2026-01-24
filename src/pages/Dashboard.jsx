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
  
  // STATE'LER
  const [recentScans, setRecentScans] = useState([]);
  const [loadingScans, setLoadingScans] = useState(true);
  
  // Aylık İstatistik State'leri
  const [monthlyStats, setMonthlyStats] = useState({
    totalSpent: 0,
    receiptCount: 0,
    averageSpend: 0
  });

  // Modal State'leri
  const [isImageModalShowing, setIsImageModalShowing] = useState(false);
  const [selectedImage, setSelectedImage] = useState({ url: '', alt: '' });
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // 1. SON 3 KAYDI ÇEKME (LİSTE İÇİN)
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
      // Kullanıcı yoksa listeyi temizle
      setRecentScans([]);
      setLoadingScans(false);
    }
  }, [user]);

  // 2. AYLIK TOPLAM HARCAMAYI HESAPLAMA
  useEffect(() => {
    if (user) {
      // Bu ayın başlangıç ve bitiş tarihlerini hesapla
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

      // Firestore sorgusu: Bu ayın verileri
      const q = query(
        collection(db, "receipts"),
        where("userId", "==", user.uid),
        where("createdAt", ">=", startOfMonth),
        where("createdAt", "<=", endOfMonth)
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let total = 0;
        let count = 0;

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // Fiyatı topla
          total += Number(data.price) || 0;
          count++;
        });

        setMonthlyStats({
          totalSpent: total,
          receiptCount: count,
          averageSpend: count > 0 ? total / count : 0
        });

      }, (error) => {
        console.error("Error calculating monthly stats:", error);
      });

      return () => unsubscribe();
    } else {
      // Kullanıcı çıkış yaptıysa istatistikleri SIFIRLA
      setMonthlyStats({
        totalSpent: 0,
        receiptCount: 0,
        averageSpend: 0
      });
    }
  }, [user]);


  // MODAL FONKSİYONLARI
  const openImageModal = (imageUrl, imageAlt) => {
    setSelectedImage({ url: imageUrl, alt: imageAlt });
    setIsImageModalShowing(true);
  };
  const closeImageModal = () => {
    setIsImageModalShowing(false);
    setSelectedImage({ url: '', alt: '' });
  };
  const openDetailModal = (receipt) => {
    setSelectedReceipt(receipt);
    setShowDetailModal(true);
  };
  const handleCardClick = (scan) => {
    if (scan.isManual) {
      openDetailModal(scan);
    } else {
      openImageModal(scan.imageUrl, scan.fileName);
    }
  };
  
  return (
    <div className="dashboard-page-wrapper p-4">
      
      <div 
        className={`dashboard-content-wrapper ${isImageModalShowing || showDetailModal ? 'content-blurred' : ''}`}
        style={{ transition: 'filter 0.3s ease-in-out' }} 
      >
        
        {/* BAŞLIK */}
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

        {/* RECENT SCANS */}
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
                  <h5 className="text-muted"><Link to="/login">Log in</Link> to see your data.</h5>
                </div>
              </div>
            </div>
          )}
          {user && !loadingScans && recentScans.length === 0 && (
             <div className="col-12">
              <div className="card shadow-sm">
                <div className="card-body p-5 text-center">
                  <h5 className="text-muted">No recent activity found.</h5>
                  <p className="text-muted mb-0">Start by scanning a receipt or entering an expense manually.</p>
                </div>
              </div>
            </div>
          )}
          {user && !loadingScans && recentScans.map(scan => (
            <div key={scan.id} className="col-lg-4 col-md-6 mb-4">
              <div 
                className="card border-0 shadow-sm h-100"
                style={{ cursor: 'pointer' }}
                onClick={() => handleCardClick(scan)}
              >
                {scan.imageUrl ? (
                    <img 
                      src={scan.imageUrl} 
                      alt={scan.fileName} 
                      className="card-img-top" 
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
                  
                  {scan.isManual && <span className="badge bg-secondary me-1">Text</span>}
                  {!scan.isManual && <span className="badge bg-info text-dark">Scanned</span>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* QUICK LINKS */}
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

        {/* MONTHLY SPENDING */}
        <h3 className="h5 mb-3">Monthly Spending (Current Month)</h3>
        <div className="row">
          
          {/* 1. TOPLAM HARCAMA */}
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <h6 className="text-muted">Total Spent</h6>
                <h2 className="display-6 fw-bold text-primary">
                  ${monthlyStats.totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </h2>
              </div>
            </div>
          </div>

          {/* 2. ORTALAMA HARCAMA */}
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <h6 className="text-muted">Average Spend per Receipt</h6>
                <h2 className="display-6 fw-bold">
                  ${monthlyStats.averageSpend.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </h2>
              </div>
            </div>
          </div>

          {/* 3. FİŞ SAYISI */}
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <h6 className="text-muted">Number of Receipts</h6>
                <h2 className="display-6 fw-bold">
                  {monthlyStats.receiptCount}
                </h2>
              </div>
            </div>
          </div>

        </div>
      
      </div> 

      {/* Modallar */}
      <ImageModal
        isShowing={isImageModalShowing}
        onClose={closeImageModal}
        imageUrl={selectedImage.url}
        imageAlt={selectedImage.alt}
      />
      <ReceiptDetailModal 
        show={showDetailModal} 
        onClose={() => setShowDetailModal(false)} 
        receipt={selectedReceipt} 
      />
    </div>
  );
}

export default Dashboard;