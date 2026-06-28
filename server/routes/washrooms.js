/**
 * routes/washrooms.js
 * Washroom CRUD endpoints.
 * GET / and GET /:id are public — no login required to browse washrooms.
 * POST / is protected — only logged-in users can add new washrooms.
 * avg_rating is calculated via SQL AVG() with LEFT JOIN so washrooms
 * with zero reviews still appear in the list (they just show null avg_rating).
 */

const express = require('express');
const pool = require('../db');
const verifyToken = require('../middleware/auth');
const router = express.Router();

// GET /api/washrooms - fetch all washrooms with average rating
// Supports optional ?search=term query parameter for filtering by name
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;

    let query;
    let params;

    if (search) {
      // ILIKE is case-insensitive LIKE in PostgreSQL
      query = `
        SELECT
          w.id,
          w.name,
          w.address,
          w.latitude,
          w.longitude,
          w.description,
          w.added_by,
          w.created_at,
          w.tags,
          ROUND(AVG(r.rating)::numeric, 1) AS avg_rating,
          COUNT(r.id) AS review_count
        FROM washrooms w
        LEFT JOIN reviews r ON r.washroom_id = w.id
        WHERE w.name ILIKE $1
        GROUP BY w.id
        ORDER BY w.created_at DESC
      `;
      params = [`%${search}%`];
    } else {
      query = `
        SELECT
          w.id,
          w.name,
          w.address,
          w.latitude,
          w.longitude,
          w.description,
          w.added_by,
          w.created_at,
          w.tags,
          ROUND(AVG(r.rating)::numeric, 1) AS avg_rating,
          COUNT(r.id) AS review_count
        FROM washrooms w
        LEFT JOIN reviews r ON r.washroom_id = w.id
        GROUP BY w.id
        ORDER BY w.created_at DESC
      `;
      params = [];
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('GET washrooms error:', err);
    res.status(500).json({ error: 'Server error fetching washrooms' });
  }
});

// GET /api/washrooms/:id - fetch a single washroom with its reviews
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get the washroom itself with its average rating
    const washroom = await pool.query(
      `SELECT
        w.id,
        w.name,
        w.address,
        w.latitude,
        w.longitude,
        w.description,
        w.added_by,
        w.created_at,
        w.tags,
        ROUND(AVG(r.rating)::numeric, 1) AS avg_rating,
        COUNT(r.id) AS review_count
      FROM washrooms w
      LEFT JOIN reviews r ON r.washroom_id = w.id
      WHERE w.id = $1
      GROUP BY w.id`,
      [id]
    );

    if (washroom.rows.length === 0) {
      return res.status(404).json({ error: 'Washroom not found' });
    }

    // Get all reviews for this washroom, newest first
    const reviews = await pool.query(
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
      [id]
    );

    res.json({
      ...washroom.rows[0],
      reviews: reviews.rows
    });
  } catch (err) {
    console.error('GET washroom error:', err);
    res.status(500).json({ error: 'Server error fetching washroom' });
  }
});

// POST /api/washrooms - create a new washroom (requires login)
router.post('/', verifyToken, async (req, res) => {
  try {
const { name, address, latitude, longitude, description, tags } = req.body;
    // Validate required fields
    if (!name || !address || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: 'Name, address, latitude, and longitude are required' });
    }

    // Validate name length
    if (name.length > 150) {
      return res.status(400).json({ error: 'Name must be 150 characters or less' });
    }

    // Validate description length if provided
    if (description && description.length > 500) {
      return res.status(400).json({ error: 'Description must be 500 characters or less' });
    }

    // Validate coordinates are real numbers in valid ranges
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || lat < -90 || lat > 90) {
      return res.status(400).json({ error: 'Latitude must be a number between -90 and 90' });
    }
    if (isNaN(lng) || lng < -180 || lng > 180) {
      return res.status(400).json({ error: 'Longitude must be a number between -180 and 180' });
    }

    // req.user.id comes from the JWT via verifyToken middleware
    const result = await pool.query(
  `INSERT INTO washrooms (name, address, latitude, longitude, description, added_by, tags)
   VALUES ($1, $2, $3, $4, $5, $6, $7)
   RETURNING id, name, address, latitude, longitude, description, added_by, created_at, tags`,
  [name, address, lat, lng, description || null, req.user.id, tags || []]
);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('POST washroom error:', err);
    res.status(500).json({ error: 'Server error creating washroom' });
  }
});
module.exports = router;