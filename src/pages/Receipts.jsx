import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaCloudUploadAlt, FaListAlt } from 'react-icons/fa';
import { db, storage } from '../firebase'; 
import { useAuth } from '../context/AuthContext'; 
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage"; 
import { collection, addDoc, query, where, onSnapshot, orderBy, deleteDoc, doc, getDoc } from "firebase/firestore"; 
import ImageModal from '../components/ImageModal';
import { Link } from 'react-router-dom';

function Receipts() {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  
  const [receipts, setReceipts] = useState([]);
  const [loadingReceipts, setLoadingReceipts] = useState(true);

  // VERİ ÇEKME
  useEffect(() => {
    setLoadingReceipts(true);
    if (user) {
      const q = query(
        collection(db, "receipts"), 
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const receiptsData = [];
        querySnapshot.forEach((doc) => {
          if(doc.data().imageUrl) {
             receiptsData.push({ id: doc.id, ...doc.data() });
          }
        });
        setReceipts(receiptsData);
        setLoadingReceipts(false);
      }, (error) => {
        console.error("Error fetching receipts: ", error);
        setLoadingReceipts(false);
      });

      return () => unsubscribe();
    } else {
      setReceipts([]);
      setLoadingReceipts(false);
    }
  }, [user]);

  // DOSYA YÜKLEME
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;
    
    if (!user) {
      setError("You must be logged in to upload a receipt.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError('');

    const storageRef = ref(storage, `receipts/${user.uid}/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      }, 
      (error) => {
        console.error("Upload error:", error);
        setError("File upload failed. Check Storage rules.");
        setIsUploading(false);
      }, 
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          try {
            await addDoc(collection(db, "receipts"), {
              userId: user.uid,
              imageUrl: downloadURL,
              fileName: file.name,
              createdAt: new Date(),
              title: file.name,
              price: 0, 
              date: new Date().toLocaleDateString(),
              isManual: false 
            });
          } catch (e) {
            console.error("Error adding document: ", e);
            setError("Failed to save receipt data.");
          }
          setIsUploading(false);
        });
      }
    );
  }, [user]);

  // SİLME FONKSİYONU (Hem DB Hem Storage)
  const handleDeleteReceipt = async (e, receiptId) => {
    e.stopPropagation(); 
    if (!window.confirm("Are you sure you want to delete this receipt? This action cannot be undone.")) {
      return;
    }

    try {
      const docRef = doc(db, "receipts", receiptId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        if (data.imageUrl) {
          const imageRef = ref(storage, data.imageUrl);
          
          await deleteObject(imageRef).catch((err) => {
             console.warn("Image delete warning:", err);
          });
        }

        await deleteDoc(docRef);
      }

    } catch (err) {
      console.error("Error deleting document: ", err);
      alert("Failed to delete receipt.");
    }
  };

  // MODAL
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
          
          <div className="mb-5">
            <h1 className="display-6 fw-bold">Scan New Receipt</h1>
            <p className="text-muted">Upload an image of your receipt.</p>
            {error && <div className="alert alert-danger">{error}</div>}
            
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

          {isUploading && (
            <div className="mb-5">
              <h3 className="h5 mb-3">Uploading Progress</h3>
              <div className="progress" style={{ height: '20px' }}>
                <div
                  className="progress-bar progress-bar-striped progress-bar-animated"
                  role="progressbar"
                  style={{ width: `${uploadProgress}%` }}
                  aria-valuenow={uploadProgress}
                >
                  {uploadProgress.toFixed(0)}%
                </div>
              </div>
              <p className="mt-2 text-muted">Uploading to cloud...</p>
            </div>
          )}

          <div className="mt-5 mb-5">
            <h3 id="scanned-section" className="h5 mb-3 fw-bold d-flex align-items-center">
                <FaListAlt className="me-2 text-muted" /> All Scanned Receipts
            </h3>
            
            <div className="card shadow-sm border-0">
                <div className="list-group list-group-flush">
                    <div className="list-group-item bg-body-tertiary text-body-secondary fw-bold small text-uppercase d-flex align-items-center">
                        <div style={{ flex: 2 }}>File Name</div>
                        <div style={{ flex: 1 }}>Date & Time</div> 
                        <div style={{ flex: 1, textAlign: 'right' }}>Total Price</div>
                        <div style={{ width: '40px' }}></div> 
                    </div>

                    {loadingReceipts && (
                        <div className="p-4 text-center text-muted">Loading receipts...</div>
                    )}

                    {!user && !loadingReceipts && (
                        <div className="p-5 text-center text-muted">
                            Please <Link to="/login">log in</Link> to view your receipts.
                        </div>
                    )}

                    {user && !loadingReceipts && receipts.length === 0 && (
                        <div className="p-5 text-center text-muted">
                            You haven't uploaded any receipts yet.
                        </div>
                    )}

                    {user && !loadingReceipts && receipts.map(receipt => (
                        <div 
                            key={receipt.id} 
                            className="list-group-item list-group-item-action d-flex align-items-center p-3"
                            style={{ cursor: 'pointer' }}
                            onClick={() => openModal(receipt.imageUrl, receipt.fileName)}
                        >
                            <div style={{ flex: 2 }} className="d-flex align-items-center">
                                <img 
                                    src={receipt.imageUrl} 
                                    alt={receipt.fileName} 
                                    className="receipt-list-thumbnail me-3" 
                                    onError={(e) => { e.target.src = 'https://placehold.co/60x60?text=Error'; }}
                                    style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                                />
                                <span className="fw-bold text-truncate">{receipt.fileName}</span>
                            </div>
                            
                            <div style={{ flex: 1 }} className="text-muted small">
                                {receipt.createdAt?.toDate ? receipt.createdAt.toDate().toLocaleDateString() : 'Just now'}
                            </div>

                            <div style={{ flex: 1, textAlign: 'right' }} className="fw-bold text-primary">
                                ${Number(receipt.price).toFixed(2)}
                            </div>
                            
                            <div style={{ width: '50px', display: 'flex', justifyContent: 'flex-end' }}>
                              <button 
                                className="delete-entry-btn"
                                onClick={(e) => handleDeleteReceipt(e, receipt.id)}
                                title="Delete Receipt"
                              >
                                <svg viewBox="0 0 448 512" className="delete-entry-svgIcon">
                                  <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
                                </svg>
                              </button>
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