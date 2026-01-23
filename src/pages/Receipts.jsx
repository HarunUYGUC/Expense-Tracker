import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { db, storage } from '../firebase'; 
import { useAuth } from '../context/AuthContext'; 
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; 
import { collection, addDoc, query, where, onSnapshot, orderBy } from "firebase/firestore"; 
import ImageModal from '../components/ImageModal';
import { Link } from 'react-router-dom';

function Receipts() {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  
  const [receipts, setReceipts] = useState([]);
  const [loadingReceipts, setLoadingReceipts] = useState(true);

  // GERÇEK ZAMANLI VERİ ÇEKME (Firestore) 
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
          // Eğer veride 'imageUrl' varsa bu bir fiştir (Manuel giriş değil), listeye ekle
          if(doc.data().imageUrl) {
             receiptsData.push({ id: doc.id, ...doc.data() });
          }
        });
        setReceipts(receiptsData);
        setLoadingReceipts(false);
      }, (error) => {
        console.error("Error fetching receipts: ", error);
        // İndeks hatası varsa konsolda link çıkacaktır
        setLoadingReceipts(false);
      });

      return () => unsubscribe();
    } else {
      setReceipts([]);
      setLoadingReceipts(false);
    }
  }, [user]);

  // GERÇEK DOSYA YÜKLEME (Firebase Storage) 
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

    // Yükleme Durumunu İzle
    uploadTask.on('state_changed', 
      (snapshot) => {
        // İlerleme yüzdesini hesapla
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      }, 
      (error) => {
        // Hata Durumu
        console.error("Upload error:", error);
        setError("File upload failed. Check Storage rules.");
        setIsUploading(false);
      }, 
      () => {
        // Başarılı Bitiş Durumu
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          // Resim yüklendi, şimdi URL'sini ve bilgilerini Firestore'a kaydet
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
            <p className="text-muted">Upload an image of your receipt. (Real Cloud Storage)</p>
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

          <div className="mb-5">
            <h3 id="scanned-section" className="h5 mb-3">All Scanned Receipts</h3>
            <div className="card shadow-sm border-0">
              <div className="list-group list-group-flush">
                
                {loadingReceipts && (
                  <div className="list-group-item p-5 text-center">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                )}

                {!user && !loadingReceipts && (
                  <div className="list-group-item p-5 text-center">
                    <h5 className="text-muted">
                      Please <Link to="/login">log in</Link> to view your receipts.
                    </h5>
                  </div>
                )}

                {user && !loadingReceipts && receipts.length === 0 && (
                  <div className="list-group-item p-5 text-center">
                    <h5 className="text-muted">You haven't uploaded any receipts yet.</h5>
                    <p className="text-muted">Try uploading one above!</p>
                  </div>
                )}
                
                {user && !loadingReceipts && receipts.map(receipt => (
                  <div 
                    key={receipt.id} 
                    className="list-group-item d-flex justify-content-between align-items-center p-3"
                    style={{ cursor: 'pointer' }}
                    onClick={() => openModal(receipt.imageUrl, receipt.fileName)}
                  >
                    <div className="d-flex align-items-center">
                      <img 
                        src={receipt.imageUrl} 
                        alt={receipt.fileName} 
                        className="receipt-list-thumbnail me-3" 
                        onError={(e) => { e.target.src = 'https://placehold.co/60x60?text=Error'; }} // Resim yüklenemezse yedek
                      />
                      <div>
                        <h6 className="mb-0 fw-bold">{receipt.fileName}</h6>
                        <small className="text-muted">
                            {/* createdAt bazen null olabilir, kontrol ekledik */}
                            {receipt.createdAt?.toDate ? receipt.createdAt.toDate().toLocaleDateString() : 'Just now'}
                        </small>
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