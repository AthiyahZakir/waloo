import React from 'react';

// Reusable error display — translates technical errors into plain language
export default function ErrorMessage({ message, onRetry }) {
  return (
    <div
      style={{
        margin: '12px 16px',
        padding: '12px 14px',
        background: '#FBD9D9',
        border: 'var(--border-thick)',
        borderRadius: 'var(--radius-button)',
        fontFamily: 'DM Sans, sans-serif',
        fontSize: '13px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '12px',
      }}
    >
      <span>{message}</span>
      {onRetry && (
        <button
          className="waloo-btn waloo-btn-secondary"
          onClick={onRetry}
          style={{ fontSize: '12px', padding: '4px 10px', flexShrink: 0 }}
        >
          Retry
        </button>
      )}
    </div>
  );
}