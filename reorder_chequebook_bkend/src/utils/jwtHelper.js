const jwt = require('jsonwebtoken');

/**
 * Generate JWT token
 */
const generateToken = (payload, expiresIn = '24h') => {
  return jwt.sign(payload, process.env.SECRET, { expiresIn });
};

/**
 * Verify JWT token
 */
const verifyToken = (token) => {
  return jwt.verify(token, process.env.SECRET);
};

/**
 * Decode JWT token without verification
 */
const decodeToken = (token) => {
  return jwt.decode(token);
};

module.exports = {
  generateToken,
  verifyToken,
  decodeToken
};