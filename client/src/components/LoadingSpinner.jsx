import React from 'react';

// Reusable loading indicator — used during any API call
export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div style={{ padding: '40px 16px', textAlign: 'center' }}>
      <div
        style={{
          width: '32px',
          height: '32px',
          border: '3px solid var(--color-surface-grey)',
          borderTop: '3px solid var(--color-ink)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 12px',
        }}
      />
      <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--color-text-muted)', margin: 0 }}>
        {message}
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}