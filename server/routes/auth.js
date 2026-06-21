const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const router = express.Router();

// POST /api/auth/register - create a new user account
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Basic validation - all fields required
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if this email or username is already taken
    const userExists = await pool.query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );
    if (userExists.rows.length > 0) {
      return res.status(409).json({ error: 'Email or username already registered' });
    }

    // Hash the password before storing it - never store plain text passwords
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user, get back their id/username/email
    const newUser = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, hashedPassword]
    );

    // Generate a JWT so the user is immediately logged in after registering
    const token = jwt.sign(
      { id: newUser.rows[0].id, username: newUser.rows[0].username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: newUser.rows[0]
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

module.exports = router;