import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const isLoggedIn = login(email, password);
    if (isLoggedIn) {
      navigate('/products');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow-sm border-0">
              <div className="card-body p-4">
                <h2 className="card-title text-center mb-4">Log In</h2>
                <form onSubmit={handleSubmit}>
                  {error && <div className="alert alert-danger">{error}</div>}
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="d-grid">
                     <button type="submit" className="btn btn-primary">Log In</button>
                  </div>
                </form>
                <div className="text-center mt-3">
                  <small>Test with: user@example.com / password123</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;