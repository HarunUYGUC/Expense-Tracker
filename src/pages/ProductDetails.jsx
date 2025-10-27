import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import { getProductById } from '../data/products';

function ProductDetails() {
  const { productId } = useParams(); // URL'den :productId parametresini al
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('1M');

  useEffect(() => {
    setLoading(true);
    // Veri çekme işlemini simüle etmek için küçük bir gecikme
    const timer = setTimeout(() => {
      const foundProduct = getProductById(productId);
      setProduct(foundProduct);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [productId]); 

  if (loading) {
    return (
        <div className="container mt-5 text-center">
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Yükleniyor...</span>
            </div>
        </div>
    );
  }

  if (!product) {
    return (
        <div className="container mt-5 alert alert-danger">
            Ürün bulunamadı. <Link to="/products">Ürünler listesine geri dön.</Link>
        </div>
    );
  }

  return (
    <div className="dashboard-page-wrapper p-4">
      <div className="container-fluid">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-3">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/products" className="text-decoration-none">Products</Link></li>
            <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="display-6 fw-bold">{product.name}</h1>
            <p className="text-muted">Purchased {product.purchaseCount} times</p>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-secondary d-flex align-items-center"><FaPencilAlt className="me-2" /> Edit</button>
            <button className="btn btn-outline-danger d-flex align-items-center"><FaTrash className="me-2" /> Delete</button>
          </div>
        </div>

        {/* Latest Purchase Card */}
        <div className="card border-0 shadow-sm mb-5">
          <div className="card-body p-4">
            <h5 className="card-title mb-4">Latest Purchase Details</h5>
            <div className="row">
              <div className="row">
                <div className="col-md-4">
                  <h6 className="text-muted">Price</h6>
                  <p className="fs-5">${product.latestPurchase.price.toFixed(2)}</p>
                </div>
                <div className="col-md-4">
                  <h6 className="text-muted">Purchase Date</h6>
                  <p className="fs-5">{product.latestPurchase.date}</p>
                </div>
                <div className="col-md-4">
                  <h6 className="text-muted">Store</h6>
                  <p className="fs-5">{product.latestPurchase.store}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Price Comparison Card */}
        <div className="card border-0 shadow-sm mb-5">
          <div className="card-body p-4">
            <h3 className="mb-4">Price Comparison</h3>
            <div className="row">
              {/* Sol Sütun: Grafik */}
              <div className="col-md-7">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="mb-0">Price Over Time</h6>
                  <div className="btn-group btn-group-sm" role="group">
                    <button type="button" className={`btn ${timeRange === '1M' ? 'btn-secondary' : 'btn-outline-secondary'}`} onClick={() => setTimeRange('1M')}>1M</button>
                    <button type="button" className={`btn ${timeRange === '6M' ? 'btn-secondary' : 'btn-outline-secondary'}`} onClick={() => setTimeRange('6M')}>6M</button>
                    <button type="button" className={`btn ${timeRange === '1Y' ? 'btn-secondary' : 'btn-outline-secondary'}`} onClick={() => setTimeRange('1Y')}>1Y</button>
                  </div>
                </div>
                
                <div 
                  className="d-flex align-items-center justify-content-center" 
                  style={{ 
                    background: 'var(--bs-tertiary-bg)', 
                    borderRadius: '8px', 
                    minHeight: '200px' 
                  }}
                >
                  <svg width="80%" height="80%" viewBox="0 0 100 50" preserveAspectRatio="none">
                      <path d="M 0,45 Q 15,10 30,30 T 60,20 T 90,40 L 100,35" 
                        stroke="var(--bs-secondary-color)" 
                        fill="transparent" 
                        strokeWidth="2" 
                        strokeLinejoin="round" 
                        strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
              {/* Sağ Sütun: Mağazaya Göre Fiyatlar */}
              <div className="col-md-5">
                <h6>Prices by Store</h6>
                <ul className="list-group list-group-flush mt-3">
                  {product.priceComparison.pricesByStore.map(store => (
                     <li key={store.id} className="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent">
                       {store.name}
                       <span className="fw-bold">${store.price.toFixed(2)}</span>
                     </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Purchase History Table */}
        <h3 className="mb-3">Purchase History</h3>
        <div className="table-responsive">
          <table className="table table-borderless">
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Store</th>
                <th scope="col" className="text-end">Price</th>
              </tr>
            </thead>
            <tbody>
              {product.purchaseHistory.map(item => (
                <tr key={item.id} style={{ borderTop: 'var(--bs-border-color-translucent)' }}> 
                  <td>{item.date}</td>
                  <td>{item.store}</td>
                  <td className="text-end">${item.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;