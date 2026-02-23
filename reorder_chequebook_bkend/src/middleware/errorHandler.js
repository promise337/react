const { errorResponse } = require('../utils/responseHandler');

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Database connection errors
  if (err.code === 'ORA-00942') {
    return errorResponse(res, 'Table or view does not exist', 500, err);
  }

  if (err.code === 'ORA-01017') {
    return errorResponse(res, 'Database authentication failed', 500, err);
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return errorResponse(res, 'Validation failed', 400, err);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return errorResponse(res, 'Invalid token', 401, err);
  }

  if (err.name === 'TokenExpiredError') {
    return errorResponse(res, 'Token expired', 401, err);
  }

  // Default error
  return errorResponse(res, 'Internal Server Error', 500, err);
};

/**
 * Async error wrapper
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  errorHandler,
  asyncHandler
};