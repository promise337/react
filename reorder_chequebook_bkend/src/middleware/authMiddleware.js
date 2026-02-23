const { verifyToken } = require('../utils/jwtHelper');
const { unauthorizedResponse, errorResponse } = require('../utils/responseHandler');

/**
 * JWT Authentication middleware
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return unauthorizedResponse(res, 'Access token is required');
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return unauthorizedResponse(res, 'Token has expired');
    }
    if (error.name === 'JsonWebTokenError') {
      return unauthorizedResponse(res, 'Invalid token');
    }
    return errorResponse(res, 'Token verification failed', 401, error);
  }
};

/**
 * Optional authentication middleware (doesn't fail if no token)
 */
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const decoded = verifyToken(token);
      req.user = decoded;
    } catch (error) {
      // Silently ignore token errors for optional auth
      req.user = null;
    }
  }
  
  next();
};

module.exports = {
  authenticateToken,
  optionalAuth
};