import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBoxOpen, FaSearch, FaChevronRight } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

function Products() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user) {
      setLoading(true);
      const q = query(
        collection(db, "receipts"),
        where("userId", "==", user.uid),
        where("isManual", "==", true)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const productMap = {};

        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data.items && Array.isArray(data.items)) {
            data.items.forEach(item => {
              const uniqueKey = `${item.brand}-${item.name}`.toLowerCase();
              
              if (!productMap[uniqueKey]) {
                productMap[uniqueKey] = {
                  id: uniqueKey,
                  name: item.name || 'Unnamed Product',
                  brand: item.brand,
                  type: item.type,
                  latestPrice: Number(item.price),
                  latestDate: data.date,
                  createdAt: data.createdAt,
                  historyCount: 1
                };
              } else {
                if (data.createdAt > productMap[uniqueKey].createdAt) {
                   productMap[uniqueKey].latestPrice = Number(item.price);
                   productMap[uniqueKey].latestDate = data.date;
                   productMap[uniqueKey].createdAt = data.createdAt;
                }
                productMap[uniqueKey].historyCount += 1;
              }
            });
          }
        });

        setProducts(Object.values(productMap));
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [user]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-page-wrapper p-4">
      <div className="container-fluid">
        
        {/* BREADCRUMB */}
        <nav aria-label="breadcrumb" className="mb-3">
          <ol className="breadcrumb">
            <li className="breadcrumb-item active" aria-current="page">Products</li>
          </ol>
        </nav>

        {/* BAŞLIK VE ARAMA KUTUSU */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
          <h1 className="display-6 fw-bold mb-3 mb-md-0">Products</h1>
          
          <div className="input-group" style={{ maxWidth: '300px' }}>
             <span className="input-group-text bg-body-tertiary border-end-0">
               <FaSearch className="text-muted" />
             </span>
             <input 
               type="text" 
               className="form-control border-start-0" 
               placeholder="Search products..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
        </div>
        
        {loading && <div className="text-center p-5"><div className="spinner-border" role="status"></div></div>}

        {!loading && products.length === 0 && (
          <div className="alert alert-info text-center">
            No product data found. Use <Link to="/texts" className="alert-link fw-bold">Texts</Link> to add products.
          </div>
        )}

        <div className="row">
          {filteredProducts.map((product) => (
            <div key={product.id} className="col-md-6 col-lg-4 col-xl-3 mb-4">
              <div className="card shadow-sm h-100 border-0 card-hover-effect">
                <div className="card-body d-flex flex-column">
                  
                  <div className="d-flex align-items-start mb-3">
                    <div className="bg-primary-subtle rounded p-3 me-3 text-primary">
                      <FaBoxOpen className="fs-3" />
                    </div>
                    <div>
                      <h6 className="card-title fw-bold mb-1 text-truncate" style={{maxWidth: '150px'}} title={product.name}>
                        {product.name}
                      </h6>
                      <small className="text-muted d-block">{product.brand}</small>
                      <span className="badge bg-secondary mt-1">{product.type}</span>
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-3 border-top d-flex justify-content-between align-items-end">
                    <div>
                      <small className="text-muted d-block" style={{fontSize: '0.75rem'}}>Last Price</small>
                      <span className="fs-5 fw-bold text-primary">${product.latestPrice.toFixed(2)}</span>
                    </div>
                    
                    <Link 
                      to={`/products/${encodeURIComponent(product.name)}?brand=${encodeURIComponent(product.brand)}`} 
                      className="btn btn-sm btn-outline-primary rounded-pill px-3"
                    >
                      Details <FaChevronRight className="ms-1" style={{fontSize: '0.7rem'}} />
                    </Link>
                  </div>
                  
                  <div className="text-end mt-2">
                     <small className="text-muted" style={{fontSize: '0.7rem'}}>
                        {product.historyCount} purchase(s) recorded
                     </small>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Products;