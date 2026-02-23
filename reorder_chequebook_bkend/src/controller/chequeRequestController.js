const oracledb = require('oracledb');
const { v4: uuidv4 } = require('uuid');
const { getConnection } = require('../config/database');
const { successResponse, errorResponse, validationErrorResponse, notFoundResponse, unauthorizedResponse } = require('../utils/responseHandler');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * Process cheque book after authorization
 */
const processChequeBook = (requestData) => {
  console.log('Cheque book has been authorized, processing...', requestData);
  // TODO: Implement actual cheque book processing logic
};

/**
 * Get filtered cheque requests by authorization status
 */
const getFilteredChequeRequests = asyncHandler(async (req, res) => {
  const { status } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  // Validate status parameter
  if (!['A', 'U'].includes(status)) {
    return validationErrorResponse(res, {
      status: 'Status must be either A (authorized) or U (unauthorized)'
    });
  }

  let connection;
  
  try {
    connection = await getConnection();
    
    // Get total count for filtered results
    const countResult = await connection.execute(
      `SELECT COUNT(*) as total FROM chq_bk_requests WHERE auth_status = :status`,
      { status },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    
    const totalRecords = countResult.rows[0].TOTAL;
    const totalPages = Math.ceil(totalRecords / limit);
    
    // Get paginated filtered data
    const result = await connection.execute(
      `SELECT * FROM (
         SELECT a.*, ROWNUM rnum FROM (
           SELECT * FROM chq_bk_requests 
           WHERE auth_status = :status 
           ORDER BY created_at DESC
         ) a WHERE ROWNUM <= :endRow
       ) WHERE rnum > :startRow`,
      {
        status,
        startRow: offset,
        endRow: offset + limit
      },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    
    const responseData = {
      requests: result.rows,
      filter: {
        status: status,
        statusDescription: status === 'A' ? 'Authorized' : 'Unauthorized'
      },
      pagination: {
        currentPage: page,
        totalPages,
        totalRecords,
        limit,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
    
    return successResponse(res, responseData, `${status === 'A' ? 'Authorized' : 'Unauthorized'} cheque requests retrieved successfully`);
    
  } catch (error) {
    console.error('Database error:', error);
    return errorResponse(res, 'Failed to retrieve filtered cheque requests', 500, error);
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

/**
 * Get all cheque requests with pagination
 */
const getAllChequeRequests = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  let connection;
  
  try {
    connection = await getConnection();
    
    // Get total count
    const countResult = await connection.execute(
      `SELECT COUNT(*) as total FROM chq_bk_requests`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    
    const totalRecords = countResult.rows[0].TOTAL;
    const totalPages = Math.ceil(totalRecords / limit);
    
    // Get paginated data
    const result = await connection.execute(
      `SELECT * FROM (
         SELECT a.*, ROWNUM rnum FROM (
           SELECT * FROM chq_bk_requests ORDER BY created_at DESC
         ) a WHERE ROWNUM <= :endRow
       ) WHERE rnum > :startRow`,
      {
        startRow: offset,
        endRow: offset + limit
      },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    
    const responseData = {
      requests: result.rows,
      pagination: {
        currentPage: page,
        totalPages,
        totalRecords,
        limit,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
    
    return successResponse(res, responseData, 'Cheque requests retrieved successfully');
    
  } catch (error) {
    console.error('Database error:', error);
    return errorResponse(res, 'Failed to retrieve cheque requests', 500, error);
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

/**
 * Create cheque book request (only for brn_user)
 */
const createChequeRequest = asyncHandler(async (req, res) => {
  const { 
    cust_ac_no, 
    branch_code, 
    cheque_book_type, 
    number_of_leaves, 
    delivery_address, 
    additional_notes 
  } = req.body;

  // Check if user has brn_user group_code
  if (req.user.groupCode !== 'brn_user') {
    return unauthorizedResponse(res, 'Only branch users can create cheque requests');
  }

  // Validation
  const errors = {};
  if (!cust_ac_no) errors.cust_ac_no = 'Customer account number is required';
  if (!branch_code) errors.branch_code = 'Branch code is required';
  if (!cheque_book_type) errors.cheque_book_type = 'Cheque book type is required';
  if (!number_of_leaves) errors.number_of_leaves = 'Number of leaves is required';
  if (!delivery_address) errors.delivery_address = 'Delivery address is required';

  if (Object.keys(errors).length > 0) {
    return validationErrorResponse(res, errors);
  }

  let connection;
  
  try {
    connection = await getConnection();
    
    const id = uuidv4();
    
    const result = await connection.execute(
      `INSERT INTO chq_bk_requests 
       (id, cust_ac_no, branch_code, cheque_book_type, number_of_leaves, delivery_address, additional_notes, created_by) 
       VALUES (:id, :cust_ac_no, :branch_code, :cheque_book_type, :number_of_leaves, :delivery_address, :additional_notes, :created_by)`,
      {
        id,
        cust_ac_no,
        branch_code,
        cheque_book_type,
        number_of_leaves,
        delivery_address,
        additional_notes: additional_notes || null,
        created_by: req.user.username
      },
      { autoCommit: true }
    );
    
    const responseData = {
      id,
      cust_ac_no,
      branch_code,
      cheque_book_type,
      number_of_leaves,
      delivery_address,
      additional_notes,
      auth_status: 'U',
      created_by: req.user.username
    };
    
    return successResponse(res, responseData, 'Cheque request created successfully', 201);
    
  } catch (error) {
    console.error('Database error:', error);
    return errorResponse(res, 'Failed to create cheque request', 500, error);
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

/**
 * Authorize cheque book request (only for brn_auth)
 */
const authorizeChequeRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if user has brn_auth group_code
  if (req.user.groupCode !== 'brn_auth') {
    return unauthorizedResponse(res, 'Only authorized users can approve cheque requests');
  }

  // Validation
  if (!id) {
    return validationErrorResponse(res, {
      id: 'Request ID is required'
    });
  }

  let connection;
  
  try {
    connection = await getConnection();
    
    // First check if request exists and is not already authorized
    const checkResult = await connection.execute(
      `SELECT * FROM chq_bk_requests WHERE id = :id AND auth_status = 'U'`,
      { id },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    
    if (checkResult.rows.length === 0) {
      return notFoundResponse(res, 'Unauthorized cheque request not found');
    }
    
    const requestData = checkResult.rows[0];
    
    // Update request to authorized
    const result = await connection.execute(
      `UPDATE chq_bk_requests 
       SET auth_status = 'A', authorized_by = :authorized_by, authorized_at = SYSDATE
       WHERE id = :id`,
      { 
        id,
        authorized_by: req.user.username
      },
      { autoCommit: true }
    );
    
    // Process the cheque book
    processChequeBook(requestData);
    
    const responseData = {
      id,
      auth_status: 'A',
      authorized_by: req.user.username
    };
    
    return successResponse(res, responseData, 'Cheque request authorized successfully');
    
  } catch (error) {
    console.error('Database error:', error);
    return errorResponse(res, 'Failed to authorize cheque request', 500, error);
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
  getAllChequeRequests,
  getFilteredChequeRequests,
  createChequeRequest,
  authorizeChequeRequest
};