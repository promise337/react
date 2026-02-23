const oracledb = require('oracledb');
const { v4: uuidv4 } = require('uuid');
const { getConnection } = require('../config/database');
const { successResponse, errorResponse, validationErrorResponse, notFoundResponse } = require('../utils/responseHandler');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * Subscribe customer for cheque book reorder notifications
 */
const subscribeCustomer = asyncHandler(async (req, res) => {
  const { 
    cust_ac_no, 
    branch_code, 
    reorder_threshold_number, 
    subscribed, 
    notify_sms, 
    notify_email, 
    notify_rm 
  } = req.body;

  // Validation
  const errors = {};
  if (!cust_ac_no) errors.cust_ac_no = 'Customer account number is required';
  if (!branch_code) errors.branch_code = 'Branch code is required';
  if (!reorder_threshold_number) errors.reorder_threshold_number = 'Reorder threshold number is required';
  if (!subscribed) errors.subscribed = 'Subscribed status is required';
  if (!notify_sms) errors.notify_sms = 'SMS notification preference is required';
  if (!notify_email) errors.notify_email = 'Email notification preference is required';
  if (!notify_rm) errors.notify_rm = 'RM notification preference is required';

  if (Object.keys(errors).length > 0) {
    return validationErrorResponse(res, errors);
  }

  let connection;
  
  try {
    connection = await getConnection();
    
    // Check if subscription already exists for this account number
    const checkResult = await connection.execute(
      `SELECT id FROM chq_bk_reorder_sub WHERE cust_ac_no = :cust_ac_no`,
      { cust_ac_no },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    
    if (checkResult.rows.length > 0) {
      // Subscription exists, update it instead
      const existingId = checkResult.rows[0].ID;
      
      await connection.execute(
        `UPDATE chq_bk_reorder_sub 
         SET branch_code = :branch_code, 
             reorder_threshold_number = :reorder_threshold_number, 
             subscribed = :subscribed, 
             notify_sms = :notify_sms, 
             notify_email = :notify_email, 
             notify_rm = :notify_rm,
             updated_date = SYSDATE
         WHERE cust_ac_no = :cust_ac_no`,
        {
          cust_ac_no,
          branch_code,
          reorder_threshold_number,
          subscribed,
          notify_sms,
          notify_email,
          notify_rm
        },
        { autoCommit: true }
      );
      
      const responseData = {
        id: existingId,
        cust_ac_no,
        branch_code,
        reorder_threshold_number,
        subscribed,
        notify_sms,
        notify_email,
        notify_rm
      };
      
      return successResponse(res, responseData, 'Customer subscription updated successfully', 200);
    }
    
    // No existing subscription, create new one
    const id = uuidv4();
    
    await connection.execute(
      `INSERT INTO chq_bk_reorder_sub 
       (id, cust_ac_no, branch_code, reorder_threshold_number, subscribed, notify_sms, notify_email, notify_rm) 
       VALUES (:id, :cust_ac_no, :branch_code, :reorder_threshold_number, :subscribed, :notify_sms, :notify_email, :notify_rm)`,
      {
        id,
        cust_ac_no,
        branch_code,
        reorder_threshold_number,
        subscribed,
        notify_sms,
        notify_email,
        notify_rm
      },
      { autoCommit: true }
    );
    
    const responseData = {
      id,
      cust_ac_no,
      branch_code,
      reorder_threshold_number,
      subscribed,
      notify_sms,
      notify_email,
      notify_rm
    };
    
    return successResponse(res, responseData, 'Customer subscription created successfully', 201);
    
  } catch (error) {
    console.error('Database error:', error);
    return errorResponse(res, 'Failed to create customer subscription', 500, error);
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
 * Unsubscribe customer from cheque book reorder notifications
 */
const unsubscribeCustomer = asyncHandler(async (req, res) => {
  const { cust_ac_no } = req.params;

  // Validation
  if (!cust_ac_no) {
    return validationErrorResponse(res, {
      cust_ac_no: 'Customer account number is required'
    });
  }

  let connection;
  
  try {
    connection = await getConnection();
    
    const result = await connection.execute(
      `UPDATE chq_bk_reorder_sub 
       SET subscribed = 'N', notify_sms = 'N', notify_email = 'N', notify_rm = 'N', updated_date = SYSDATE
       WHERE cust_ac_no = :cust_ac_no`,
      { cust_ac_no },
      { autoCommit: true }
    );
    
    if (result.rowsAffected === 0) {
      return notFoundResponse(res, 'Customer subscription not found');
    }
    
    return successResponse(res, { cust_ac_no, subscribed: 'N' }, 'Customer unsubscribed successfully');
    
  } catch (error) {
    console.error('Database error:', error);
    return errorResponse(res, 'Failed to unsubscribe customer', 500, error);
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
 * Get all subscriptions with pagination
 */
const getAllSubscriptions = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  let connection;
  
  try {
    connection = await getConnection();
    
    // Get total count
    const countResult = await connection.execute(
      `SELECT COUNT(*) as total FROM chq_bk_reorder_sub`
    );
    const totalRecords = countResult.rows[0][0];
    
    // Get paginated data
    const result = await connection.execute(
      `SELECT * FROM (
         SELECT a.*, ROWNUM rnum FROM (
           SELECT * FROM chq_bk_reorder_sub ORDER BY created_date DESC
         ) a WHERE ROWNUM <= :endRow
       ) WHERE rnum > :startRow`,
      { 
        startRow: offset,
        endRow: offset + limit
      },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    
    const totalPages = Math.ceil(totalRecords / limit);
    
    const responseData = {
      subscriptions: result.rows,
      pagination: {
        currentPage: page,
        totalPages,
        totalRecords,
        limit,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
    
    return successResponse(res, responseData, 'Subscriptions retrieved successfully');
    
  } catch (error) {
    console.error('Database error:', error);
    return errorResponse(res, 'Failed to retrieve subscriptions', 500, error);
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
 * Get subscriptions by status filter
 */
const getSubscriptionsByStatus = asyncHandler(async (req, res) => {
  const { status } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  // Validation
  if (!status || !['Y', 'N'].includes(status.toUpperCase())) {
    return validationErrorResponse(res, {
      status: 'Status must be Y (subscribed) or N (unsubscribed)'
    });
  }

  let connection;
  
  try {
    connection = await getConnection();
    
    const subscriptionStatus = status.toUpperCase();
    
    // Get total count for filtered data
    const countResult = await connection.execute(
      `SELECT COUNT(*) as total FROM chq_bk_reorder_sub WHERE subscribed = :status`,
      { status: subscriptionStatus }
    );
    const totalRecords = countResult.rows[0][0];
    
    // Get paginated filtered data
    const result = await connection.execute(
      `SELECT * FROM (
         SELECT a.*, ROWNUM rnum FROM (
           SELECT * FROM chq_bk_reorder_sub 
           WHERE subscribed = :status 
           ORDER BY created_date DESC
         ) a WHERE ROWNUM <= :endRow
       ) WHERE rnum > :startRow`,
      { 
        status: subscriptionStatus,
        startRow: offset,
        endRow: offset + limit
      },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    
    const totalPages = Math.ceil(totalRecords / limit);
    
    const responseData = {
      subscriptions: result.rows,
      filter: {
        status: subscriptionStatus,
        statusDescription: subscriptionStatus === 'Y' ? 'Subscribed' : 'Unsubscribed'
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
    
    return successResponse(res, responseData, `${subscriptionStatus === 'Y' ? 'Subscribed' : 'Unsubscribed'} customers retrieved successfully`);
    
  } catch (error) {
    console.error('Database error:', error);
    return errorResponse(res, 'Failed to retrieve filtered subscriptions', 500, error);
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
 * Update subscription details
 */
const updateSubscription = asyncHandler(async (req, res) => {
  const { cust_ac_no } = req.params;
  const { 
    branch_code, 
    reorder_threshold_number, 
    subscribed, 
    notify_sms, 
    notify_email, 
    notify_rm 
  } = req.body;

  // Validation
  if (!cust_ac_no) {
    return validationErrorResponse(res, {
      cust_ac_no: 'Customer account number is required'
    });
  }

  const errors = {};
  if (branch_code === undefined && reorder_threshold_number === undefined && 
      subscribed === undefined && notify_sms === undefined && 
      notify_email === undefined && notify_rm === undefined) {
    return validationErrorResponse(res, {
      fields: 'At least one field must be provided for update'
    });
  }

  let connection;
  
  try {
    connection = await getConnection();
    
    // Check if subscription exists
    const checkResult = await connection.execute(
      `SELECT id FROM chq_bk_reorder_sub WHERE cust_ac_no = :cust_ac_no`,
      { cust_ac_no },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    
    if (checkResult.rows.length === 0) {
      return notFoundResponse(res, 'Customer subscription not found');
    }
    
    // Build dynamic update query
    const updateFields = [];
    const bindParams = { cust_ac_no };
    
    if (branch_code !== undefined) {
      updateFields.push('branch_code = :branch_code');
      bindParams.branch_code = branch_code;
    }
    if (reorder_threshold_number !== undefined) {
      updateFields.push('reorder_threshold_number = :reorder_threshold_number');
      bindParams.reorder_threshold_number = reorder_threshold_number;
    }
    if (subscribed !== undefined) {
      updateFields.push('subscribed = :subscribed');
      bindParams.subscribed = subscribed;
    }
    if (notify_sms !== undefined) {
      updateFields.push('notify_sms = :notify_sms');
      bindParams.notify_sms = notify_sms;
    }
    if (notify_email !== undefined) {
      updateFields.push('notify_email = :notify_email');
      bindParams.notify_email = notify_email;
    }
    if (notify_rm !== undefined) {
      updateFields.push('notify_rm = :notify_rm');
      bindParams.notify_rm = notify_rm;
    }
    
    updateFields.push('updated_date = SYSDATE');
    
    const updateQuery = `UPDATE chq_bk_reorder_sub SET ${updateFields.join(', ')} WHERE cust_ac_no = :cust_ac_no`;
    
    await connection.execute(updateQuery, bindParams, { autoCommit: true });
    
    // Fetch updated record
    const result = await connection.execute(
      `SELECT * FROM chq_bk_reorder_sub WHERE cust_ac_no = :cust_ac_no`,
      { cust_ac_no },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    
    return successResponse(res, result.rows[0], 'Subscription updated successfully');
    
  } catch (error) {
    console.error('Database error:', error);
    return errorResponse(res, 'Failed to update subscription', 500, error);
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
  subscribeCustomer,
  unsubscribeCustomer,
  getAllSubscriptions,
  getSubscriptionsByStatus,
  updateSubscription
};