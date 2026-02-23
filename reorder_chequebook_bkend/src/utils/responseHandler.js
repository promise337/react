/**
 * Standard success response
 */
const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    ...(Array.isArray(data) && { count: data.length })
  });
};

/**
 * Standard error response
 */
const errorResponse = (res, message = 'Internal Server Error', statusCode = 500, error = null) => {
  const response = {
    success: false,
    message
  };

  if (error && process.env.APP_MODE !== 'production') {
    response.error = error.message || error;
  }

  return res.status(statusCode).json(response);
};

/**
 * Validation error response
 */
const validationErrorResponse = (res, errors) => {
  return res.status(400).json({
    success: false,
    message: 'Validation failed',
    errors
  });
};

/**
 * Not found response
 */
const notFoundResponse = (res, message = 'Resource not found') => {
  return res.status(404).json({
    success: false,
    message
  });
};

/**
 * Unauthorized response
 */
const unauthorizedResponse = (res, message = 'Unauthorized access') => {
  return res.status(401).json({
    success: false,
    message
  });
};

module.exports = {
  successResponse,
  errorResponse,
  validationErrorResponse,
  notFoundResponse,
  unauthorizedResponse
};