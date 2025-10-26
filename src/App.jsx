import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';

import Dashboard from './pages/Dashboard';
import Receipts from './pages/Receipts';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import LoginPage from './pages/LoginPage';

const Stores = () => <div className="container mt-4"><h1>Stores Page</h1></div>;
const AnalyzeExpenses = () => <div className="container mt-4"><h1>Analyze Expenses Page</h1></div>;
const Reports = () => <div className="container mt-4"><h1>Reports Page</h1></div>;
const Settings = () => <div className="container mt-4"><h1>Settings Page</h1></div>;

function App() {
  return (
    <div>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          <Route path="/receipts" element={<Receipts />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:productId" element={<ProductDetails />} />
          <Route path="/stores" element={<Stores />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Quick Links'te kullandığımız rotalar */}
          <Route path="/analyze" element={<AnalyzeExpenses />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;