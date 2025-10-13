import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';

import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import LoginPage from './pages/LoginPage';

const Dashboard = () => <div className="container mt-4"><h1>Dashboard Page</h1></div>;
const Receipts = () => <div className="container mt-4"><h1>Receipts Page</h1></div>;
const Stores = () => <div className="container mt-4"><h1>Stores Page</h1></div>;

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
           {/* <Route path="/signup" element={<SignUpPage />} /> */}
        </Routes>
      </main>
    </div>
  );
}

export default App;