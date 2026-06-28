import React, { useState, useContext } from 'react';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Logo from '../components/Logo';

const MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY;
const DEFAULT_CENTRE = { lat: 6.9271, lng: 79.8612 };

export default function AddWashroom() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [pinLocation, setPinLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tags, setTags] = useState([]);

  // When user clicks the map, drop a pin at that location
  const handleMapClick = (e) => {
    setPinLocation({
      lat: e.detail.latLng.lat,
      lng: e.detail.latLng.lng,
    });
  };

  const toggleTag = (tag) => {
  setTags(prev =>
    prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
  );
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!pinLocation) {
      setError('Please click on the map to set the washroom location.');
      return; 
    }
    if (!name.trim()) {
      setError('Please enter a washroom name.');
      return;
    }
    if (!address.trim()) {
      setError('Please enter an address.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/api/washrooms', {
        name: name.trim(),
        address: address.trim(),
        latitude: pinLocation.lat,
        longitude: pinLocation.lng,
        description: description.trim() || undefined, tags,
      });
      navigate('/map');
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to add washroom. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const AVAILABLE_TAGS = [
  { key: 'wheelchair', label: '♿ Wheelchair Accessible' },
  { key: 'baby_changing', label: '👶 Baby Changing' },
  { key: 'shower', label: '🚿 Shower Available' },
  { key: 'paid', label: '💰 Paid Entry' },
  { key: 'key_required', label: '🔒 Requires Key' },
  { key: 'open_24h', label: '🌙 Open 24 Hours' },
];

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '20px 16px' }}>
      {/* Back button */}
      <button
        className="waloo-btn waloo-btn-secondary"
        onClick={() => navigate('/map')}
        style={{ marginBottom: '16px' }}
      >
        ← Back to map
      </button>

      <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '22px', marginTop: 0 }}>
        Add a Washroom
      </h1>

      {/* Map for pin placement */}
      <div className="waloo-card" style={{ padding: 0, overflow: 'hidden', marginBottom: '16px' }}>
        <p style={{
          margin: 0,
          padding: '10px 14px',
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '13px',
          color: 'var(--color-text-muted)',
          borderBottom: 'var(--border-thick)',
          background: 'var(--color-surface-grey)',
        }}>
          {pinLocation
            ? `📍 Pin set at ${pinLocation.lat.toFixed(5)}, ${pinLocation.lng.toFixed(5)} — click elsewhere to move it`
            : 'Click on the map to drop a pin at the washroom location'}
        </p>
        <div style={{ height: '280px' }}>
          <APIProvider apiKey={MAPS_KEY}>
            <Map
              defaultCenter={DEFAULT_CENTRE}
              defaultZoom={13}
              gestureHandling="greedy"
              mapId="waloo-add-map"
              style={{ width: '100%', height: '100%' }}
              onClick={handleMapClick}
            >
              {pinLocation && (
                <AdvancedMarker position={pinLocation}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    background: 'var(--color-yellow)',
                    border: 'var(--border-thick)',
                    borderRadius: 'var(--radius-pin)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-sticker)',
                  }}>
                    <Logo size={16} />
                  </div>
                </AdvancedMarker>
              )}
            </Map>
          </APIProvider>
        </div>
      </div>

      {/* Form */}
      <div className="waloo-card">
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>
              Washroom name *
            </label>
            <input
              className="waloo-input"
              type="text"
              placeholder="e.g. Central Library Washroom"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={150}
              required
            />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>
              Address *
            </label>
            <input
              className="waloo-input"
              type="text"
              placeholder="e.g. 42 Library Street"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>
              Description (optional)
            </label>
            <textarea
              className="waloo-input"
              placeholder="Is it clean? Free to use? Accessible?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
  <label style={{ display: 'block', fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', fontWeight: 500, marginBottom: '8px' }}>
    Facilities (optional)
  </label>
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
    {AVAILABLE_TAGS.map((tag) => (
      <button
        key={tag.key}
        type="button"
        onClick={() => toggleTag(tag.key)}
        style={{
          background: tags.includes(tag.key) ? 'var(--color-yellow)' : 'var(--color-bg)',
          border: 'var(--border-thick)',
          borderRadius: '20px',
          padding: '6px 12px',
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '13px',
          cursor: 'pointer',
          boxShadow: tags.includes(tag.key) ? 'var(--shadow-sticker)' : 'none',
          transition: 'all 0.1s ease',
        }}
      >
        {tag.label}
      </button>
    ))}
  </div>
</div>

          {error && (
            <p style={{
              padding: '8px 12px',
              background: '#FBD9D9',
              border: 'var(--border-thick)',
              borderRadius: 'var(--radius-button)',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '13px',
              marginBottom: '12px',
            }}>
              {error}
            </p>
          )}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              className="waloo-btn"
              disabled={loading || !pinLocation}
              style={{ flex: 1 }}
            >
              {loading ? 'Adding...' : 'Add Washroom'}
            </button>
            <button
              type="button"
              className="waloo-btn waloo-btn-secondary"
              onClick={() => navigate('/map')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}