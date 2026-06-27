/**
 * routes/reviews.js
 * Review endpoints for washrooms.
 * POST / is protected — only logged-in users can submit reviews.
 * The database schema enforces UNIQUE(washroom_id, user_id) so one user
 * can only review each washroom once — caught here via PostgreSQL error code 23505.
 * GET /:washroom_id is public.
 */

const express = require('express');
const pool = require('../db');
const verifyToken = require('../middleware/auth');
const router = express.Router();

// POST /api/reviews - submit a review for a washroom (requires login)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { washroom_id, rating, comment } = req.body;

    // Validate required fields
    if (!washroom_id || rating === undefined) {
      return res.status(400).json({ error: 'washroom_id and rating are required' });
    }

    // Validate rating is between 1 and 5
    const ratingNum = parseInt(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ error: 'Rating must be a number between 1 and 5' });
    }

    // Check the washroom actually exists before trying to review it
    const washroomExists = await pool.query(
      'SELECT id FROM washrooms WHERE id = $1',
      [washroom_id]
    );
    if (washroomExists.rows.length === 0) {
      return res.status(404).json({ error: 'Washroom not found' });
    }

    // Insert the review - the UNIQUE(washroom_id, user_id) constraint in the
    // database schema enforces one review per user per washroom at the DB level
    const result = await pool.query(
      `INSERT INTO reviews (washroom_id, user_id, rating, comment)
       VALUES ($1, $2, $3, $4)
       RETURNING id, washroom_id, user_id, rating, comment, created_at`,
      [washroom_id, req.user.id, ratingNum, comment || null]
    );

// Auto-deletion check: if this washroom now has 2+ one-star reviews
// from different users, it gets automatically removed from the platform
const oneStarCheck = await pool.query(
  `SELECT COUNT(DISTINCT user_id) as one_star_count 
   FROM reviews 
   WHERE washroom_id = $1 AND rating = 1`,
  [washroom_id]
);

const oneStarCount = parseInt(oneStarCheck.rows[0].one_star_count);

if (oneStarCount >= 2) {
  // Delete the washroom — reviews cascade automatically via foreign key
  await pool.query('DELETE FROM washrooms WHERE id = $1', [washroom_id]);
  return res.status(201).json({
    ...result.rows[0],
    warning: 'This washroom has been removed due to multiple poor reviews.'
  });
}

res.status(201).json(result.rows[0]);
  } catch (err) {
    // PostgreSQL error code 23505 = unique constraint violation
    // This means the user already reviewed this washroom
    if (err.code === '23505') {
      return res.status(409).json({ error: 'You have already reviewed this washroom' });
    }
    console.error('POST review error:', err);
    res.status(500).json({ error: 'Server error submitting review' });
  }
});

// GET /api/reviews/:washroom_id - get all reviews for a washroom
router.get('/:washroom_id', async (req, res) => {
  try {
    const { washroom_id } = req.params;

    const result = await pool.query(
      `SELECT
        r.id,
        r.rating,
        r.comment,
        r.created_at,
        u.username
      FROM reviews r
      JOIN users u ON u.id = r.user_id
      WHERE r.washroom_id = $1
      ORDER BY r.created_at DESC`,
      [washroom_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('GET reviews error:', err);
    res.status(500).json({ error: 'Server error fetching reviews' });
  }
});

module.exports = router;