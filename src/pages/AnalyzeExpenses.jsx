import React from 'react';
import { FaChevronDown, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { spendingOverTimeData, spendingByCategoryData, priceAnalysisData } from '../data/analysisData';

function AnalyzeExpenses() {
  return (
    <div className="dashboard-page-wrapper p-4">
      <div className="container-fluid">
        {/* HEADER & FİLTRELER */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5">
          <div className="mb-3 mb-md-0">
            <h1 className="display-6 fw-bold">Expense Analysis</h1>
            <p className="text-muted">Analyze your spending patterns and gain insights into your expenses.</p>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-secondary d-flex align-items-center">
              Category <FaChevronDown className="ms-2 small" />
            </button>
            <button className="btn btn-outline-secondary d-flex align-items-center">
              Date <FaChevronDown className="ms-2 small" />
            </button>
            <button className="btn btn-outline-secondary d-flex align-items-center">
              Product <FaChevronDown className="ms-2 small" />
            </button>
          </div>
        </div>

        {/* GRAFİKLER */}
        <div className="row mb-5">
          {/* Spending Over Time */}
          <div className="col-lg-6 mb-4 mb-lg-0">
            <div className="card shadow-sm h-100 card-accent">
              <div className="card-body p-4">
                <h5 className="card-title">Spending Over Time</h5>
                <p className="text-muted small mb-3">Last 6 Months</p>
                <div className="d-flex align-items-baseline mb-4">
                  <h2 className="fw-bold me-3 mb-0">$2,500</h2>
                  <span className="text-success fw-medium d-flex align-items-center">
                    <FaArrowUp className="me-1 small" /> 12%
                  </span>
                </div>
                {/* Grafik Alanı */}
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <AreaChart data={spendingOverTimeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0d6efd" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#0d6efd" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} />
                      <YAxis hide={true} />
                      <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.1} />
                      <Tooltip />
                      <Area type="monotone" dataKey="amount" stroke="#0d6efd" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Spending by Category */}
          <div className="col-lg-6">
            <div className="card shadow-sm h-100 card-accent">
              <div className="card-body p-4">
                <h5 className="card-title">Spending by Category</h5>
                <p className="text-muted small mb-3">This Month</p>
                <div className="d-flex align-items-baseline mb-4">
                  <h2 className="fw-bold me-3 mb-0">$1,800</h2>
                  <span className="text-danger fw-medium d-flex align-items-center">
                    <FaArrowDown className="me-1 small" /> 8%
                  </span>
                </div>
                {/* Grafik Alanı (Bar Chart) */}
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <BarChart data={spendingByCategoryData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} />
                      <YAxis hide={true} />
                      <Tooltip cursor={{fill: 'transparent'}} />
                      <Bar dataKey="amount" fill="#e9ecef" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PRICE ANALYSIS TABLOSU */}
        <div className="mb-5">
          <h3 className="h4 fw-bold mb-4">Price Analysis</h3>
          <div className="card shadow-sm">
            <div className="table-responsive">
              <table className="table table-borderless mb-0 align-middle">
                <thead className="bg-light">
                  <tr>
                    <th scope="col" className="ps-4 py-3 text-muted fw-normal">Product</th>
                    <th scope="col" className="py-3 text-muted fw-normal">Average Price</th>
                    <th scope="col" className="py-3 text-muted fw-normal">Lowest Price</th>
                    <th scope="col" className="py-3 text-muted fw-normal">Highest Price</th>
                    <th scope="col" className="py-3 text-muted fw-normal">Price Change</th>
                  </tr>
                </thead>
                <tbody>
                  {priceAnalysisData.map(item => (
                    <tr key={item.id} style={{ borderTop: 'var(--bs-border-color-translucent)' }}>
                      <td className="ps-4 fw-medium">{item.product}</td>
                      <td>${item.avg.toFixed(2)}</td>
                      <td className="text-muted">${item.min.toFixed(2)}</td>
                      <td>${item.max.toFixed(2)}</td>
                      <td className={item.isPositive ? 'text-success' : 'text-danger'}>
                        {item.isPositive ? '+' : ''}{item.change}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyzeExpenses;
