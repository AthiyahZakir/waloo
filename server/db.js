/**
 * db.js
 * PostgreSQL connection pool.
 * Uses the DATABASE_URL environment variable from .env.
 * The pool manages multiple concurrent connections efficiently —
 * import this module in any route file that needs database access.
 */

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

module.exports = pool;
