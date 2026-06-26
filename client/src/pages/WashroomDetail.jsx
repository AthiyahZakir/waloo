import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Logo from '../components/Logo';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function WashroomDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [washroom, setWashroom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const fetchWashroom = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/washrooms/${id}`);
      setWashroom(res.data);
    } catch (err) {
      setError('Could not load washroom details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWashroom();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setReviewError('Please select a star rating before submitting.');
      return;
    }
    setReviewLoading(true);
    setReviewError(null);
    try {
      await axios.post('/api/reviews', {
        washroom_id: parseInt(id),
        rating,
        comment,
      });
      setReviewSuccess(true);
      setRating(0);
      setComment('');
      // Refresh the washroom data so the new review appears immediately
      fetchWashroom();
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to submit review';
      setReviewError(msg);
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading washroom..." />;


  if (error) return (
  <div style={{ padding: '20px' }}>
    <ErrorMessage message={error} onRetry={fetchWashroom} />
    <button className="waloo-btn waloo-btn-secondary" onClick={() => navigate('/map')} style={{ marginTop: '12px' }}>
      ← Back to map
    </button>
  </div>
  );

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

      {/* Washroom info card */}
      <div className="waloo-card" style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            background: 'var(--color-yellow)',
            border: 'var(--border-thick)',
            borderRadius: 'var(--radius-pin)',
            flexShrink: 0,
          }}>
            <Logo size={18} />
          </span>
          <h1 style={{ margin: 0, fontFamily: 'Space Grotesk, sans-serif', fontSize: '20px' }}>
            {washroom.name}
          </h1>
        </div>
        <p style={{ margin: '0 0 6px', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--color-text-muted)' }}>
          📍 {washroom.address}
        </p>
        <p style={{ margin: '0 0 8px', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: 'var(--color-text-muted)' }}>
          {washroom.avg_rating ? `⭐ ${washroom.avg_rating} average` : 'No reviews yet'} · {washroom.review_count} review{washroom.review_count !== 1 ? 's' : ''}
        </p>
        {washroom.description && (
          <p style={{ margin: 0, fontFamily: 'DM Sans, sans-serif', fontSize: '14px' }}>
            {washroom.description}
          </p>
        )}
      </div>

      {/* Review form — only shown if logged in */}
      {user ? (
        <div className="waloo-card" style={{ marginBottom: '16px', background: 'var(--color-surface-grey)' }}>
          <h2 style={{ marginTop: 0, fontFamily: 'Space Grotesk, sans-serif', fontSize: '16px' }}>
            Leave a review
          </h2>
          {reviewSuccess && (
            <p style={{
              padding: '8px 12px',
              background: '#D9FBD9',
              border: 'var(--border-thick)',
              borderRadius: 'var(--radius-button)',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '13px',
              marginBottom: '12px',
            }}>
              Review submitted — thanks!
            </p>
          )}
          <form onSubmit={handleReviewSubmit}>
            {/* Star picker */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  style={{
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: star <= rating ? 'var(--color-ink)' : 'var(--color-star-empty)',
                  }}
                >
                  ★
                </span>
              ))}
            </div>
            <textarea
              className="waloo-input"
              placeholder="Share what you thought..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              style={{ marginBottom: '10px', resize: 'vertical' }}
            />
            {reviewError && (
              <p style={{
                padding: '8px 12px',
                background: '#FBD9D9',
                border: 'var(--border-thick)',
                borderRadius: 'var(--radius-button)',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '13px',
                marginBottom: '10px',
              }}>
                {reviewError}
              </p>
            )}
            <button type="submit" className="waloo-btn" disabled={reviewLoading}>
              {reviewLoading ? 'Submitting...' : 'Submit review'}
            </button>
          </form>
        </div>
      ) : (
        <div className="waloo-card" style={{ marginBottom: '16px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px' }}>
            <button className="waloo-btn" onClick={() => navigate('/login')}>
              Log in to leave a review
            </button>
          </p>
        </div>
      )}

      {/* Reviews list */}
      <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '16px', marginBottom: '12px' }}>
        Reviews ({washroom.reviews?.length || 0})
      </h2>
      {washroom.reviews?.length === 0 ? (
        <p style={{ fontFamily: 'DM Sans, sans-serif', color: 'var(--color-text-muted)', fontSize: '14px' }}>
          No reviews yet — be the first!
        </p>
      ) : (
        washroom.reviews?.map((review) => (
          <div key={review.id} className="waloo-card" style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '13px' }}>
                {review.username}
              </span>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
              </span>
            </div>
            {review.comment && (
              <p style={{ margin: 0, fontFamily: 'DM Sans, sans-serif', fontSize: '13px' }}>
                {review.comment}
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
}