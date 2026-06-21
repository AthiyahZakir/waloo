import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function MapPage() {
  const { user } = useContext(AuthContext);

  return (
    <div style={{ padding: '20px' }}>
      <h1>WaLoo Map (placeholder — built on Day 4)</h1>
      <p>Logged in as: {user?.username}</p>
    </div>
  );
}