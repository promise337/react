const oracledb = require('oracledb');
const { getConnection } = require('../config/database');
const { successResponse, errorResponse, notFoundResponse, validationErrorResponse } = require('../utils/responseHandler');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * - Old flow that filtered by CHEQUE_BOOK_FACILITY in query
 * Search customer by account number
 */
// const searchCustomer = asyncHandler(async (req, res) => {
//   const { accountNumber } = req.params;

//   // Validation
//   if (!accountNumber) {
//     return validationErrorResponse(res, {
//       accountNumber: 'Account number is required'
//     });
//   }

//   let connection;
  
//   try {
//     connection = await getConnection();
    
//     const result = await connection.execute(
//       `SELECT * FROM sttm_cust_account 
//        WHERE cust_ac_no = :accountNumber 
//        and CHEQUE_BOOK_FACILITY = 'Y'`,
//       { accountNumber },
//       { outFormat: oracledb.OUT_FORMAT_OBJECT }
//     );
    
//     if (result.rows.length === 0) {
//       return notFoundResponse(res, 'Customer account not found');
//     }

//     const customer = result.rows[0];
    
//     return successResponse(res, customer, 'Customer details retrieved successfully');
    
//   } catch (error) {
//     console.error('Database error:', error);
//     return errorResponse(res, 'Failed to retrieve customer details', 500, error);
//   } finally {
//     if (connection) {
//       try {
//         await connection.close();
//       } catch (error) {
//         console.error('Error closing connection:', error);
//       }
//     }
//   }
// });

/**
 * Search customer by account number
 */
const searchCustomer = asyncHandler(async (req, res) => {
  const { accountNumber } = req.params;

  // Validation
  if (!accountNumber) {
    return validationErrorResponse(res, {
      accountNumber: 'Account number is required'
    });
  }

  let connection;
  
  try {
    connection = await getConnection();
    
    const result = await connection.execute(
      `SELECT BRANCH_CODE, CUST_AC_NO, AC_DESC, CUST_NO, CCY, ACCOUNT_CLASS, CHEQUE_BOOK_FACILITY 
       FROM sttm_cust_account 
       WHERE cust_ac_no = :accountNumber`,
      { accountNumber },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    
    if (result.rows.length === 0) {
      return notFoundResponse(res, 'Customer account not found');
    }

    const customer = result.rows[0];
    
    // Check if customer is eligible for cheque book
    if (customer.CHEQUE_BOOK_FACILITY === 'N') {
      return errorResponse(res, 'Customer is not eligible for cheque book', 400);
    }
    
    return successResponse(res, customer, 'Customer details retrieved successfully');
    
  } catch (error) {
    console.error('Database error:', error);
    return errorResponse(res, 'Failed to retrieve customer details', 500, error);
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
  searchCustomer
};