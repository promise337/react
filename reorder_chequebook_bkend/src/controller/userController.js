const oracledb = require('oracledb');
const { getConnection } = require('../config/database');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * Get all users with selected fields
 */
const getAllUsers = asyncHandler(async (req, res) => {
  let connection;
  
  try {
    connection = await getConnection();
    
    const result = await connection.execute(
      `SELECT username, fullname, group_code branch_code, user_status 
       FROM users 
       ORDER BY username`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    
    return successResponse(res, result.rows, 'Users retrieved successfully');
    
  } catch (error) {
    console.error('Database error:', error);
    return errorResponse(res, 'Failed to fetch users', 500, error);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error('Error closing connection:', error);
      }
    }
  }
});

module.exports = {
  getAllUsers
};