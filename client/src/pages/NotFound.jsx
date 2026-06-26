import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: '400px', margin: '80px auto', padding: '0 16px', textAlign: 'center' }}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '64px',
          height: '64px',
          background: 'var(--color-yellow)',
          border: 'var(--border-thick)',
          borderRadius: 'var(--radius-pin)',
          boxShadow: 'var(--shadow-sticker)',
          marginBottom: '20px',
        }}
      >
        <Logo size={32} />
      </div>
      <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '28px', marginTop: 0 }}>
        404 — Lost?
      </h1>
      <p style={{ fontFamily: 'DM Sans, sans-serif', color: 'var(--color-text-muted)', marginBottom: '24px' }}>
        This page doesn't exist. Maybe the washroom moved.
      </p>
      <button className="waloo-btn" onClick={() => navigate('/map')}>
        Back to the map
      </button>
    </div>
  );
}