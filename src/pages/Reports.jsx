import React from 'react';
import { Link } from 'react-router-dom';
import { FaChartBar, FaFileAlt, FaReceipt } from 'react-icons/fa';

function Reports() {
  return (
    <div className="dashboard-page-wrapper p-4">
      <div className="container">
        <div className="mb-5 text-center">
          <h1 className="display-5 fw-bold mb-3">View Reports</h1>
          <p className="text-muted fs-5">Select a report category to view detailed information.</p>
        </div>

        <div className="row justify-content-center g-4">
          
          {/* Scanned Receipts Butonu */}
          <div className="col-md-5">
            <Link to="/receipts#scanned-section" className="text-decoration-none text-dark">
              <div className="card border-0 shadow-sm h-100 p-5 text-center quick-link-card">
                <div className="mb-4 d-flex justify-content-center">
                   <div className="quick-link-icon" style={{ width: '80px', height: '80px', fontSize: '2.5rem' }}>
                      <FaReceipt />
                   </div>
                </div>
                <h3 className="h4 fw-bold mb-3">All Scanned Receipts</h3>
                <p className="text-muted">View all receipts you have uploaded via image scanning.</p>
                <button className="btn btn-outline-primary mt-3">View Receipts</button>
              </div>
            </Link>
          </div>

          {/* Manual Entries Butonu */}
          <div className="col-md-5">
            <Link to="/texts#manual-section" className="text-decoration-none text-dark">
              <div className="card border-0 shadow-sm h-100 p-5 text-center quick-link-card">
                <div className="mb-4 d-flex justify-content-center">
                   <div className="quick-link-icon" style={{ width: '80px', height: '80px', fontSize: '2.5rem' }}>
                      <FaFileAlt />
                   </div>
                </div>
                <h3 className="h4 fw-bold mb-3">All Manual Entries</h3>
                <p className="text-muted">View all expenses you have entered manually via the text form.</p>
                <button className="btn btn-outline-primary mt-3">View Entries</button>
              </div>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Reports;