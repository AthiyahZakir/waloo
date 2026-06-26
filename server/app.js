const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const washroomRoutes = require('./routes/washrooms');
const reviewRoutes = require('./routes/reviews');

const app = express();

// Allow requests from the frontend — update FRONTEND_URL in production env vars
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));
app.use(express.json());

// Auth routes - register, login, etc.
app.use('/api/auth', authRoutes);
app.use('/api/washrooms', washroomRoutes); 
app.use('/api/reviews', reviewRoutes);

app.get('/api/health', async (req, res) => {
  try {
    const pool = require('./db');
    await pool.query('SELECT 1');
    res.json({ status: 'OK', message: 'WaLoo API is running', database: 'connected' });
  } catch (err) {
    res.status(500).json({ status: 'ERROR', message: 'Database connection failed', error: err.message });
  }
});

module.exports = app;