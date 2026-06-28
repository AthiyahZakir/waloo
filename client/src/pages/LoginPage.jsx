import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import thinker from '../assets/thinker.png';

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate('/map');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* Left: login form */}
      <div className="login-form-side">
        <div className="waloo-card" style={{ width: '100%', maxWidth: '380px' }}>
          <h1 style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '26px',
            marginTop: 0,
            marginBottom: '6px',
          }}>
            Welcome back
          </h1>
          <p style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '14px',
            color: 'var(--color-text-muted)',
            marginBottom: '20px',
            marginTop: 0,
          }}>
            Log in to find washrooms near you.
          </p>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '12px' }}>
              <input
                className="waloo-input"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <input
                className="waloo-input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <p style={{
                color: 'var(--color-ink)',
                background: '#FBD9D9',
                border: 'var(--border-thick)',
                borderRadius: 'var(--radius-button)',
                padding: '8px 12px',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '13px',
                marginBottom: '10px',
              }}>
                {error}
              </p>
            )}
            <button type="submit" className="waloo-btn" disabled={loading} style={{ width: '100%', marginTop: '4px' }}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', marginBottom: 0, marginTop: '16px' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--color-ink)', fontWeight: 500 }}>
              Register here
            </Link>
          </p>
        </div>
      </div>

      {/* Right: image */}
      <div className="login-image-side">
        <img src={thinker} alt="The Thinker on a toilet" />
      </div>

    </div>
  );
}