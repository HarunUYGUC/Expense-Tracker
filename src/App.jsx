import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';

import Dashboard from './pages/Dashboard';
import Receipts from './pages/Receipts';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Stores from './pages/Stores';
import StoreDetails from './pages/StoreDetails';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import AnalyzeExpenses from './pages/AnalyzeExpenses';
import Settings from './pages/Settings';

const Reports = () => <div className="container mt-4"><h1>Reports Page</h1></div>;

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
          <Route path="/stores/:storeId" element={<StoreDetails />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          
          {/* Quick Links */}
          <Route path="/analyze" element={<AnalyzeExpenses />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;