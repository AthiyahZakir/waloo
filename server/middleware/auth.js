const jwt = require('jsonwebtoken');

// Verifies the JWT sent in the Authorization header.
// If valid, attaches the decoded user info to req.user and lets the request continue.
// If missing or invalid, blocks the request with a 401.
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  // Expected format: "Bearer <token>"
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = verifyToken;