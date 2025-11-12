import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      setLoading(true); 
      await login(email, password);
      navigate('/'); 
    } catch (err) {
      setError('Invalid email or password');
      console.error(err);
    }
    setLoading(false); 
  };

  return (
    <div className="login-page-wrapper py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow-sm border-0">
              <div className="card-body p-4 p-md-5">
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
                    <div className="position-relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <span onClick={() => setShowPassword(!showPassword)} className="input-group-password-icon">
                        {showPassword ? <FaEye /> : <FaEyeSlash />}
                      </span>
                    </div>
                  </div>

                  <div className="d-grid">
                     <button type="submit" className="btn btn-primary" disabled={loading}>
                       {loading ? 'Logging in...' : 'Log In'}
                     </button>
                  </div>
                </form>
                <div className="text-center mt-3">
                  <small className="text-muted">
                    Don't have an account? <Link to="/signup" className="fw-medium text-decoration-none">Sign Up</Link>
                  </small>
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
