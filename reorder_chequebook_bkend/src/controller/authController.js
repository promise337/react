const oracledb = require('oracledb');
const { getConnection } = require('../config/database');
const { successResponse, errorResponse, notFoundResponse, validationErrorResponse } = require('../utils/responseHandler');
const { asyncHandler } = require('../middleware/errorHandler');
const { generateToken } = require('../utils/jwtHelper');

/**
 * Login for Staff
 */
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // Validation
  if (!username || !password) {
    return validationErrorResponse(res, {
      username: !username ? 'Username is required' : undefined,
      password: !password ? 'Password is required' : undefined
    });
  }

  let connection;
  
  try {
    connection = await getConnection();
    
    const result = await connection.execute(
      `SELECT username, group_code, user_status, fullname, branch_code 
       FROM users 
       WHERE UPPER(username) = UPPER(:username)`,
      { username },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    
    if (result.rows.length === 0) {
      return notFoundResponse(res, 'User not found');
    }

    const user = result.rows[0];
    
    // Generate JWT token
    const tokenPayload = {
      username: user.USERNAME,
      groupCode: user.GROUP_CODE,
      userStatus: user.USER_STATUS,
      branchCode: user.BRANCH_CODE
    };
    
    const token = generateToken(tokenPayload);
    
    const responseData = {
      ...user,
      token
    };
    
    return successResponse(res, responseData, 'Login successful');
    
  } catch (error) {
    console.error('Database error:', error);
    return errorResponse(res, 'Login failed', 500, error);
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
  login
};