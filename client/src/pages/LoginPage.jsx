import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

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
    <div style={{ maxWidth: '380px', margin: '60px auto', padding: '0 16px' }}>
      <div className="waloo-card">
        <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '24px', marginTop: 0 }}>
          Login
        </h1>
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
            <p
              style={{
                color: 'var(--color-ink)',
                background: '#FBD9D9',
                border: 'var(--border-thick)',
                borderRadius: 'var(--radius-button)',
                padding: '8px 12px',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '13px',
              }}
            >
              {error}
            </p>
          )}
          <button type="submit" className="waloo-btn" disabled={loading} style={{ width: '100%', marginTop: '4px' }}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', marginBottom: 0 }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--color-ink)', fontWeight: 500 }}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}