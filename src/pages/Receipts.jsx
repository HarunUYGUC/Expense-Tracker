import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaCloudUploadAlt, FaFileAlt } from 'react-icons/fa';
import { dashboardData } from '../data/dashboardData';
import ImageModal from '../components/ImageModal';

function Receipts() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
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

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;
    setIsUploading(true);
    setUploadProgress(0);
    
    const simulateUpload = () => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 20;
        setUploadProgress(progress);
        
        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
          }, 1000); 
        }
      }, 500);
    };
    simulateUpload();
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'application/pdf': [] },
    maxSize: 10485760
  });

  return (
    <div className="receipts-page-wrapper p-4">

      <div 
        className={isModalShowing ? 'content-blurred' : ''}
        style={{ transition: 'filter 0.3s ease-in-out' }}
      >
        <div className="container-fluid">
          
          {/* YENİ FİŞ TARAMA */}
          <div className="mb-5">
            <h1 className="display-6 fw-bold">Scan New Receipt</h1>
            <p className="text-muted">Upload an image of your receipt to automatically extract expense data.</p>
            
            <div 
              {...getRootProps()} 
              className={`dropzone-container ${isDragActive ? 'dropzone-active' : ''}`}
            >
              <input {...getInputProps()} />
              <FaCloudUploadAlt className="dropzone-icon mb-3" />
              <p className="mb-1">
                <span className="dropzone-link-text">Click to upload</span> or drag and drop
              </p>
              <p className="text-muted small">PNG, JPG or PDF (MAX. 10MB)</p>
            </div>
          </div>

          {/* YÜKLEME İLERLEME ÇUBUĞU */}
          {isUploading && (
            <div className="mb-5">
                <h3 className="h5 mb-3">Scanning Progress</h3>
                <div className="progress" style={{ height: '20px' }}>
                <div
                    className="progress-bar progress-bar-striped progress-bar-animated"
                    role="progressbar"
                    style={{ width: `${uploadProgress}%` }}
                    aria-valuenow={uploadProgress}
                    aria-valuemin="0"
                    aria-valuemax="100"
                >
                    {uploadProgress > 0 && `${uploadProgress}%`}
                </div>
                </div>
                <p className="mt-2 text-muted">Processing...</p>
                {uploadProgress === 100 && (
                <p className="text-success fw-bold">Scan complete!</p>
                )}
                <p className="text-muted small mt-3">
                Your data is securely processed and will not be shared with third parties. <a href="#">Learn more.</a>
                </p>
            </div>
            )}

          {/* TÜM FİŞLERİN LİSTESİ  */}
          <div className="mb-5">
            <h3 id="scanned-section" className="h5 mb-3">All Scanned Receipts</h3>
            <div className="card border-0 shadow-sm">
              <div className="list-group list-group-flush">
                {[...dashboardData.recentScans].reverse().map(receipt => (
                  <div 
                    key={receipt.id} 
                    className="list-group-item d-flex justify-content-between align-items-center p-3"
                    style={{ cursor: 'pointer' }}
                    onClick={() => openModal(receipt.img, receipt.title)}
                  >
                    <div className="d-flex align-items-center">
                      <img 
                        src={receipt.img} 
                        alt={receipt.title} 
                        className="receipt-list-thumbnail me-3" 
                      />
                      <div>
                        <h6 className="mb-0 fw-bold">{receipt.title}</h6>
                        <small className="text-muted">{receipt.date}</small>
                      </div>
                    </div>
                    <div className="text-end">
                      <span className="fw-bold">${receipt.price.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

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

export default Receipts;