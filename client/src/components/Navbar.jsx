import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Logo from './Logo';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav
      style={{
        padding: '12px 20px',
        borderBottom: 'var(--border-thick)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Link to="/map" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            background: 'var(--color-yellow)',
            border: 'var(--border-thick)',
            borderRadius: 'var(--radius-pin)',
          }}
        >
          <Logo size={18} />
        </span>
        <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '18px', color: 'var(--color-ink)' }}>
          WaLoo
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {user ? (
          <>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px' }}>Hi, {user.username}</span>
            <button onClick={handleLogout} className="waloo-btn waloo-btn-secondary">
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="waloo-btn waloo-btn-secondary" style={{ textDecoration: 'none' }}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}