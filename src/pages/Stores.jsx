import React from 'react';
import { Link } from 'react-router-dom';
import { FaStore, FaMapMarkerAlt } from 'react-icons/fa';
import { allStores } from '../data/storesData';

function Stores() {
  return (
    <div className="dashboard-page-wrapper p-4">
      <div className="container-fluid">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-3">
          <ol className="breadcrumb">
            <li className="breadcrumb-item active" aria-current="page">Stores</li>
          </ol>
        </nav>

        <h1 className="display-6 fw-bold mb-4">Stores</h1>

        <div className="row">
          {allStores.map(store => (
            <div key={store.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card shadow-sm h-100 card-accent">
                <div className="card-body d-flex flex-column">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-light rounded-circle p-3 me-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                      <FaStore className="text-primary fs-4" />
                    </div>
                    <div>
                      <h5 className="card-title mb-1">{store.name}</h5>
                      <p className="card-text text-muted small">
                        <FaMapMarkerAlt className="me-1" /> {store.address}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-auto d-flex justify-content-between align-items-center">
                     <div>
                        <small className="text-muted d-block">Total Spent</small>
                        <span className="fw-bold">${store.stats.totalSpent.toLocaleString()}</span>
                     </div>
                     <Link to={`/stores/${store.id}`} className="btn btn-outline-primary btn-sm">
                        View Details
                    </Link>
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

export default Stores;
