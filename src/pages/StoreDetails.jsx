import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaSearch, FaChevronDown } from 'react-icons/fa';
import { getStoreById } from '../data/storesData';

function StoreDetails() {
  const { storeId } = useParams();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setStore(getStoreById(storeId));
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [storeId]);

  if (loading) return <div className="container mt-5 text-center"><div className="spinner-border" role="status"></div></div>;
  if (!store) return <div className="container mt-5 alert alert-danger">Mağaza bulunamadı.</div>;

  return (
    <div className="dashboard-page-wrapper p-4">
      <div className="container-fluid">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/stores" className="text-decoration-none">Stores</Link></li>
            <li className="breadcrumb-item active" aria-current="page">{store.name}</li>
          </ol>
        </nav>

        {/* Başlık Bölümü */}
        <div className="mb-5">
          <h1 className="display-5 fw-bold mb-2">{store.name}</h1>
          <p className="text-muted fs-5">{store.address}</p>
        </div>

        <div className="row">
          {/* SOL SÜTUN (İstatistikler) */}
          <div className="col-lg-4 mb-4 mb-lg-0">
            
            {/* Average Spend */}
            <div className="card shadow-sm mb-3">
              <div className="card-body p-4">
                <h6 className="text-muted fw-normal mb-3">Average Spend per Visit</h6>
                <h2 className="fw-bold mb-2">${store.stats.avgSpend.toFixed(2)}</h2>
                <p className={`mb-0 fw-medium ${store.stats.avgSpendChange >= 0 ? 'text-success' : 'text-danger'}`}>
                   {store.stats.avgSpendChange >= 0 ? '+' : ''}{store.stats.avgSpendChange}% vs last month
                </p>
              </div>
            </div>

            {/* Total Spent */}
            <div className="card shadow-sm mb-3">
              <div className="card-body p-4">
                 <h6 className="text-muted fw-normal mb-3">Total Spent Here</h6>
                 <h2 className="fw-bold mb-2">${store.stats.totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                 <p className="text-muted mb-0">Across {store.stats.visitCount} visits</p>
              </div>
            </div>

             {/* Most Frequent Purchase */}
             <div className="card shadow-sm">
              <div className="card-body p-4">
                 <h6 className="text-muted fw-normal mb-3">Most Frequent Purchase</h6>
                 <h3 className="fw-bold mb-0">{store.stats.mostFrequentItem}</h3>
              </div>
            </div>

          </div>

          {/* SAĞ SÜTUN (Arama ve Tablo) */}
          <div className="col-lg-8">
             <div className="d-flex gap-3 mb-4">
              <div className="input-group shadow-sm">
                <span className="input-group-text bg-transparent border-end-0 ps-3">
                  <FaSearch className="text-muted" />
                </span>
                <input type="text" className="form-control border-start-0 ps-0" placeholder="Search purchases..." />
              </div>
              <button className="btn btn-white shadow-sm d-flex align-items-center text-nowrap px-3" style={{ border: '1px solid var(--bs-border-color)' }}>
                 Date Range <FaChevronDown className="ms-2 small text-muted" />
              </button>
            </div>

            <div className="card shadow-sm">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th scope="col" className="py-3 ps-4 text-muted fw-normal small text-uppercase">Date</th>
                      <th scope="col" className="py-3 text-muted fw-normal small text-uppercase">Receipt ID</th>
                      <th scope="col" className="py-3 text-muted fw-normal small text-uppercase text-center">Items</th>
                      <th scope="col" className="py-3 pe-4 text-muted fw-normal small text-uppercase text-end">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {store.purchases.map(purchase => (
                      <tr key={purchase.id}>
                        <td className="ps-4 fw-medium">{purchase.date}</td>
                        <td>
                          <a href="#" className="text-decoration-none fw-medium">{purchase.receiptId}</a>
                        </td>
                        <td className="text-center text-muted">{purchase.items}</td>
                        <td className="pe-4 text-end fw-bold">${purchase.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StoreDetails;
