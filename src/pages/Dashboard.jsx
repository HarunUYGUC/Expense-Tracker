import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import { dashboardData } from '../data/dashboardData';
import ImageModal from '../components/ImageModal';

function Dashboard() {
  const [isModalShowing, setIsModalShowing] = useState(false);
  const [selectedImage, setSelectedImage] = useState({ url: '', alt: '' });

  const openModal = (imageUrl, imageAlt) => {
    setSelectedImage({ url: imageUrl, alt: imageAlt });
    setIsModalShowing(true);
  };

  const closeModal = () => {
    setIsModalShowing(false);
    setSelectedImage({ url: '', alt: '' });
  };

  return (
    <div className="dashboard-page-wrapper p-4">
      
      <div 
        className={`dashboard-content-wrapper ${isModalShowing ? 'content-blurred' : ''}`}
        style={{ transition: 'filter 0.3s ease-in-out' }} 
      >
        
        {/* BAŞLIK BÖLÜMÜ */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="display-6 fw-bold">Dashboard</h1>
          <Link to="/receipts" className="btn btn-primary d-flex align-items-center">
            <FaPlus className="me-2" /> New Scan
          </Link>
        </div>

        {/* RECENT SCANS BÖLÜMÜ */}
        <h3 className="h5 mb-3">Recent Scans</h3>
        <div className="row mb-4">
        {dashboardData.recentScans.slice(-3).reverse().map(scan => (
            <div key={scan.id} className="col-lg-4 col-md-6 mb-4">
              <div 
                className="card border-0 shadow-sm h-100"
                style={{ cursor: 'pointer' }}
                onClick={() => openModal(scan.img, scan.title)}
              >
                <img 
                  src={scan.img} 
                  className="card-img-top" 
                  alt={scan.title} 
                  style={{ height: '200px', objectFit: 'cover' }} 
                />
                <div className="card-body">
                  <h6 className="card-title">{scan.title}</h6>
                  <p className="card-text text-muted">${scan.price.toFixed(2)}</p>
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

      <ImageModal
        isShowing={isModalShowing}
        onClose={closeModal}
        imageUrl={selectedImage.url}
        imageAlt={selectedImage.alt}
      />
    </div>
  );
}

export default Dashboard;