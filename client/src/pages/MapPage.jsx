import React, { useState, useEffect, useContext } from 'react';
import { APIProvider, Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const [communityMessage, setCommunityMessage] = useState(location.state?.deletedMessage || null);

  // Fetch all washrooms on mount
  useEffect(() => {
    const fetchWashrooms = async () => {
      try {
        setLoading(true);
        const res = await api.get('/api/washrooms');
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

  // Calculate straight-line distance between two coordinates in km
  const getDistanceKm = (lat1, lng1, lat2, lng2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Convert km to walking minutes (~5km/h)
  const toWalkingMins = (km) => Math.round(km / 5 * 60);

  // Client-side search filter
  const filtered = washrooms.filter((w) =>
    w.name.toLowerCase().includes(search.toLowerCase())
  );

  // If user location is known, sort by distance and show 5 closest first, rest after
  const sortedFiltered = userLocation
    ? [
        ...filtered
          .map(w => ({
            ...w,
            distanceKm: getDistanceKm(
              userLocation.lat, userLocation.lng,
              parseFloat(w.latitude), parseFloat(w.longitude)
            )
          }))
          .sort((a, b) => a.distanceKm - b.distanceKm)
      ]
    : filtered;

  // Cards: 5 closest first, then the rest
  const closestFive = userLocation ? sortedFiltered.slice(0, 5) : [];
  const theRest = userLocation ? sortedFiltered.slice(5) : sortedFiltered;
  const cardList = userLocation ? [...closestFive, ...theRest] : sortedFiltered;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 57px)' }}>

      {/* Community deletion message */}
      {communityMessage && (
        <div style={{
          padding: '12px 16px',
          background: '#D9FBD9',
          border: 'var(--border-thick)',
          borderBottom: 'var(--border-thick)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '13px',
        }}>
          <span>🌿 {communityMessage}</span>
          <button
            onClick={() => setCommunityMessage(null)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 600,
              fontSize: '16px',
              color: 'var(--color-ink)',
              padding: '0 4px',
            }}
          >
            ×
          </button>
        </div>
      )}

     {/* Header: location + search centered, add washroom pinned right */}
<div style={{
  padding: '8px 12px',
  borderBottom: 'var(--border-thick)',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  background: 'var(--color-bg)',
  flexWrap: 'wrap',
}}>
  <button
    className="waloo-btn waloo-btn-secondary"
    onClick={handleMyLocation}
    style={{ whiteSpace: 'nowrap', fontSize: '13px', padding: '8px 10px' }}
    title="Go to my location"
  >
    📍 My Location
  </button>

  <input
    className="waloo-input"
    type="text"
    placeholder="Search washrooms..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    style={{ flex: 1, minWidth: '120px' }}
  />

  {user && (
    <button
      className="waloo-btn"
      onClick={() => navigate('/add')}
      style={{ whiteSpace: 'nowrap', fontSize: '13px', padding: '8px 10px' }}
    >
      + Add
    </button>
  )}
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
            {userLocation && (
              <AdvancedMarker position={userLocation}>
                <div style={{
                  width: '22px',
                  height: '22px',
                  background: '#FF4444',
                  border: 'var(--border-thick)',
                  borderRadius: '50%',
                  boxShadow: 'var(--shadow-sticker)',
                }} />
              </AdvancedMarker>
            )}
            {sortedFiltered.map((washroom) => (
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

      {/* Washroom cards */}
      {cardList.length > 0 && (
        <div
          style={{
            maxHeight: '200px',
            overflowY: 'auto',
            display: 'flex',
            gap: '12px',
            padding: '12px 16px',
            borderTop: 'var(--border-thick)',
            background: 'var(--color-surface-grey)',
          }}
        >
          {cardList.map((w, index) => (
            <div
  key={w.id}
  className="waloo-card"
  style={{
    minWidth: '180px',
    maxWidth: '200px',
    flexShrink: 0,
    cursor: 'pointer',
    border: userLocation && index < 5 ? '2.5px solid var(--color-ink)' : 'var(--border-thick)',
    boxShadow: userLocation && index < 5 ? 'var(--shadow-sticker)' : 'none',
    display: 'flex',
    flexDirection: 'column',
  }}
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
                <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '13px', lineHeight: '1.3' }}>
  {w.name}
</span>
              </div>

              {/* Walking distance — only for closest 5 */}
              {userLocation && index < 5 && w.distanceKm !== undefined && (
                <p style={{ margin: '0 0 6px', fontFamily: 'Space Grotesk, sans-serif', fontSize: '12px', fontWeight: 600, color: 'var(--color-ink)' }}>
                  🚶 {toWalkingMins(w.distanceKm)} min walk
                </p>
              )}

              <p style={{ margin: '0 0 8px', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                {w.avg_rating ? `⭐ ${w.avg_rating}` : 'No reviews yet'} · {w.review_count} review{w.review_count !== 1 ? 's' : ''}
              </p>

              {w.tags && w.tags.length > 0 && (
                <div style={{ display: 'flex', gap: '4px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  {w.tags.map((tag) => {
                    const tagConfig = {
                      wheelchair: { emoji: '♿', bg: '#E8D5F5' },
                      baby_changing: { emoji: '👶', bg: '#FFD6E7' },
                      shower: { emoji: '🚿', bg: '#D6EAF8' },
                      paid: { emoji: '💰', bg: '#FFF3CD' },
                      key_required: { emoji: '🔒', bg: '#FFE5CC' },
                      open_24h: { emoji: '🌙', bg: '#D5F5E3' },
                    };
                    const config = tagConfig[tag] || { emoji: '•', bg: '#F0F0EE' };
                    return (
                      <span
                        key={tag}
                        title={tag.replace('_', ' ')}
                        style={{
                          fontSize: '12px',
                          background: config.bg,
                          border: 'var(--border-thick)',
                          borderRadius: '50%',
                          width: '22px',
                          height: '22px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {config.emoji}
                      </span>
                    );
                  })}
                </div>
              )}

              <button className="waloo-btn" style={{ width: '100%', fontSize: '12px', padding: '6px 10px', marginTop: 'auto' }}>
  View details
</button>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && cardList.length === 0 && (
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
              top: -5,
              right: -5,
              width: '16px',
              height: '16px',
              background: 'var(--color-ink)',
              color: '#FFFFFF',
              borderRadius: '50%',
              border: '1.5px solid #FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              fontSize: '7px',
              }}
        >
          {washroom.avg_rating}
        </div>
      )}
    </div>
  );
}