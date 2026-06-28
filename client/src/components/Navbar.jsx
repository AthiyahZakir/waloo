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
    <nav style={{
      padding: '10px 16px',
      borderBottom: 'var(--border-thick)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'var(--color-bg)',
      minHeight: '57px',
      position: 'relative',
    }}>

      {/* Left: logo + name + about */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
        <Link to="/map" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '44px',
            height: '44px',
            background: 'var(--color-yellow)',
            border: 'var(--border-thick)',
            borderRadius: 'var(--radius-pin)',
            flexShrink: 0,
          }}>
            <Logo size={26} />
          </span>
          <span style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700,
            fontSize: '22px',
            color: 'var(--color-ink)',
            whiteSpace: 'nowrap',
          }}>
            WaLoo
          </span>
        </Link>

        {/* About link — desktop only */}
        <Link
          to="/about"
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '14px',
            fontWeight: 500,
            color: 'var(--color-text-muted)',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}
          className="nav-about-link"
        >
          About
        </Link>
      </div>

      {/* Centre: quote — desktop only */}
      <div className="nav-quote" style={{
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        pointerEvents: 'none',
      }}>
        <span style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontStyle: 'italic',
          fontSize: '15px',
          fontWeight: 500,
          color: 'var(--color-text-muted)',
          whiteSpace: 'nowrap',
        }}>
          "Because nature calls everywhere."
        </span>
      </div>

      {/* Right: user info + logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        {user ? (
          <>
            <span style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '13px',
              color: 'var(--color-text-muted)',
              whiteSpace: 'nowrap',
            }}
              className="nav-username"
            >
              Hi, {user.username}
            </span>
            <button onClick={handleLogout} className="waloo-btn waloo-btn-secondary" style={{ fontSize: '13px', padding: '8px 12px' }}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="waloo-btn waloo-btn-secondary" style={{ textDecoration: 'none', fontSize: '13px', padding: '8px 12px' }}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}