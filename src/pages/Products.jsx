import React from 'react';
import { Link } from 'react-router-dom';
import { allProducts } from '../data/products';

function Products() {
  return (
<div className="dashboard-page-wrapper p-4">
      <div className="container-fluid">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-3">
          <ol className="breadcrumb">
            <li className="breadcrumb-item active" aria-current="page">Products</li>
          </ol>
        </nav>

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="display-6 fw-bold">Products</h1>
        </div>

        <div className="row">
          {allProducts.map(product => (
            <div key={product.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text text-muted">
                    Last purchased from {product.latestPurchase.store} for ${product.latestPurchase.price.toFixed(2)}.
                  </p>
                  <Link to={`/products/${product.id}`} className="btn btn-outline-primary mt-auto">
                    View Details
                  </Link>
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