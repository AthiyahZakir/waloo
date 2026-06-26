import React, { useState, useEffect, useContext } from 'react';
import { APIProvider, Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY;
const DEFAULT_CENTRE = { lat: 6.9271, lng: 79.8612 }; // Colombo

export default function MapPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [washrooms, setWashrooms] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  // Fetch all washrooms on mount
  useEffect(() => {
    const fetchWashrooms = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/washrooms');
        setWashrooms(res.data);
      } catch (err) {
        setError('Failed to load washrooms. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchWashrooms();
  }, []);

  // My Location handler
  const handleMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(loc);
      },
      () => {
        alert('Unable to get your location. Please check your browser permissions.');
      }
    );
  };

  // Client-side search filter
  const filtered = washrooms.filter((w) =>
    w.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 57px)' }}>

      {/* Header: search bar + buttons */}
      <div
        style={{
          padding: '10px 16px',
          borderBottom: 'var(--border-thick)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'var(--color-bg)',
        }}
      >
        <input
          className="waloo-input"
          type="text"
          placeholder="Search washrooms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: '320px' }}
        />
        <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
          <button
            className="waloo-btn waloo-btn-secondary"
            onClick={handleMyLocation}
            style={{ whiteSpace: 'nowrap' }}
            title="Go to my location"
          >
            📍 My Location
          </button>
          {user && (
            <button
              className="waloo-btn"
              onClick={() => navigate('/add')}
              style={{ whiteSpace: 'nowrap' }}
            >
              + Add Washroom
            </button>
          )}
        </div>
      </div>

      {/* Status messages */}
      {loading && <LoadingSpinner message="Loading washrooms..." />}
      {error && <ErrorMessage message={error} onRetry={() => window.location.reload()} />}

      {/* Map */}
      <div style={{ flex: 1 }}>
        <APIProvider apiKey={MAPS_KEY}>
          <Map
            defaultCenter={DEFAULT_CENTRE}
            defaultZoom={14}
            gestureHandling="greedy"
            mapId="waloo-map"
            style={{ width: '100%', height: '100%' }}
          >
            <MapController userLocation={userLocation} />
            {filtered.map((washroom) => (
              <AdvancedMarker
                key={washroom.id}
                position={{ lat: parseFloat(washroom.latitude), lng: parseFloat(washroom.longitude) }}
                onClick={() => setSelectedId(washroom.id === selectedId ? null : washroom.id)}
              >
                <WalooPin
                  washroom={washroom}
                  isSelected={washroom.id === selectedId}
                  onViewDetails={() => navigate(`/washroom/${washroom.id}`)}
                />
              </AdvancedMarker>
            ))}
          </Map>
        </APIProvider>
      </div>

      {/* Washroom cards grid below the map */}
      {filtered.length > 0 && (
        <div
          style={{
            maxHeight: '220px',
            overflowY: 'auto',
            display: 'flex',
            gap: '12px',
            padding: '12px 16px',
            borderTop: 'var(--border-thick)',
            background: 'var(--color-surface-grey)',
          }}
        >
          {filtered.map((w) => (
            <div
              key={w.id}
              className="waloo-card"
              style={{ minWidth: '200px', maxWidth: '220px', flexShrink: 0, cursor: 'pointer' }}
              onClick={() => navigate(`/washroom/${w.id}`)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '28px',
                    height: '28px',
                    background: 'var(--color-yellow)',
                    border: 'var(--border-thick)',
                    borderRadius: 'var(--radius-pin)',
                    flexShrink: 0,
                  }}
                >
                  <Logo size={14} />
                </span>
                <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '13px' }}>
                  {w.name}
                </span>
              </div>
              <p style={{ margin: '0 0 4px', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                {w.address}
              </p>
              <p style={{ margin: '0 0 8px', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                {w.avg_rating ? `⭐ ${w.avg_rating}` : 'No reviews yet'} · {w.review_count} review{w.review_count !== 1 ? 's' : ''}
              </p>
              <button className="waloo-btn" style={{ width: '100%', fontSize: '12px', padding: '6px 10px' }}>
                View details
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div style={{ padding: '20px 16px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', color: 'var(--color-text-muted)' }}>
            No washrooms found — be the first to add one!
          </p>
          {user && (
            <button className="waloo-btn" onClick={() => navigate('/add')}>
              + Add Washroom
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Inner component that can access the map instance via useMap()
function MapController({ userLocation }) {
  const map = useMap();

  useEffect(() => {
    if (map && userLocation) {
      map.panTo(userLocation);
      map.setZoom(15);
    }
  }, [map, userLocation]);

  return null;
}

// Custom WaLoo map pin component
function WalooPin({ washroom, isSelected, onViewDetails }) {
  const size = isSelected ? 34 : 28;

  return (
    <div style={{ position: 'relative', cursor: 'pointer' }}>
      {/* Callout label — only shown when selected */}
      {isSelected && (
        <div
          style={{
            position: 'absolute',
            bottom: size + 8,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--color-yellow)',
            border: 'var(--border-thick)',
            borderRadius: '6px',
            boxShadow: 'var(--shadow-sticker)',
            padding: '4px 8px',
            whiteSpace: 'nowrap',
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '12px',
            fontWeight: 500,
          }}
        >
          <div>{washroom.name}</div>
          <button
            className="waloo-btn"
            onClick={onViewDetails}
            style={{ fontSize: '11px', padding: '3px 8px', marginTop: '4px', width: '100%' }}
          >
            View details
          </button>
        </div>
      )}

      {/* Pin badge */}
      <div
        style={{
          width: size,
          height: size,
          background: 'var(--color-yellow)',
          border: 'var(--border-thick)',
          borderRadius: 'var(--radius-pin)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isSelected ? 'var(--shadow-sticker)' : 'none',
          transition: 'all 0.1s ease',
        }}
      >
        <Logo size={size * 0.55} />
      </div>

      {/* Rating badge — only shown if there are reviews */}
      {washroom.avg_rating && (
        <div
          style={{
            position: 'absolute',
            top: -6,
            right: -6,
            width: '18px',
            height: '18px',
            background: 'var(--color-ink)',
            color: '#FFFFFF',
            borderRadius: '50%',
            border: '1.5px solid #FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700,
            fontSize: '8px',
          }}
        >
          {washroom.avg_rating}
        </div>
      )}
    </div>
  );
}