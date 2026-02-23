// const express = require('express');
// const router = express.Router();
// const { getAllChequeRequests, getFilteredChequeRequests, createChequeRequest, authorizeChequeRequest } = require('../controller/chequeRequestController');
// const { authenticateToken } = require('../middleware/authMiddleware');

// /**
//  * @swagger
//  * /api/v1/cheque-requests:
//  *   get:
//  *     summary: Get all cheque requests with pagination
//  *     tags:
//  *       - Cheque Requests
//  *     security:
//  *       - bearerAuth: []
//  *     description: Retrieve all cheque book requests with pagination support
//  *     parameters:
//  *       - in: query
//  *         name: page
//  *         schema:
//  *           type: integer
//  *           minimum: 1
//  *           default: 1
//  *         description: Page number
//  *       - in: query
//  *         name: limit
//  *         schema:
//  *           type: integer
//  *           minimum: 1
//  *           maximum: 100
//  *           default: 10
//  *         description: Number of records per page
//  *     responses:
//  *       200:
//  *         description: Cheque requests retrieved successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: true
//  *                 message:
//  *                   type: string
//  *                   example: "Cheque requests retrieved successfully"
//  *                 data:
//  *                   type: object
//  *                   properties:
//  *                     requests:
//  *                       type: array
//  *                       items:
//  *                         type: object
//  *                         description: "Cheque request record"
//  *                     pagination:
//  *                       type: object
//  *                       properties:
//  *                         currentPage:
//  *                           type: integer
//  *                           example: 1
//  *                         totalPages:
//  *                           type: integer
//  *                           example: 5
//  *                         totalRecords:
//  *                           type: integer
//  *                           example: 50
//  *                         limit:
//  *                           type: integer
//  *                           example: 10
//  *                         hasNext:
//  *                           type: boolean
//  *                           example: true
//  *                         hasPrev:
//  *                           type: boolean
//  *                           example: false
//  *       401:
//  *         description: Unauthorized
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: "#/components/schemas/ErrorResponse"
//  *       500:
//  *         description: Internal server error
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: "#/components/schemas/ErrorResponse"
//  */
// router.get('/', authenticateToken, getAllChequeRequests);

// /**
//  * @swagger
//  * /api/v1/cheque-requests/filter/{status}:
//  *   get:
//  *     summary: Get filtered cheque requests by authorization status
//  *     tags:
//  *       - Cheque Requests
//  *     security:
//  *       - bearerAuth: []
//  *     description: Retrieve cheque book requests filtered by authorization status (A for authorized, U for unauthorized)
//  *     parameters:
//  *       - in: path
//  *         name: status
//  *         required: true
//  *         schema:
//  *           type: string
//  *           enum: [A, U]
//  *         description: Authorization status (A = Authorized, U = Unauthorized)
//  *         example: "U"
//  *       - in: query
//  *         name: page
//  *         schema:
//  *           type: integer
//  *           minimum: 1
//  *           default: 1
//  *         description: Page number
//  *       - in: query
//  *         name: limit
//  *         schema:
//  *           type: integer
//  *           minimum: 1
//  *           maximum: 100
//  *           default: 10
//  *         description: Number of records per page
//  *     responses:
//  *       200:
//  *         description: Filtered cheque requests retrieved successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: true
//  *                 message:
//  *                   type: string
//  *                   example: "Unauthorized cheque requests retrieved successfully"
//  *                 data:
//  *                   type: object
//  *                   properties:
//  *                     requests:
//  *                       type: array
//  *                       items:
//  *                         type: object
//  *                         description: "Cheque request record"
//  *                     filter:
//  *                       type: object
//  *                       properties:
//  *                         status:
//  *                           type: string
//  *                           example: "U"
//  *                         statusDescription:
//  *                           type: string
//  *                           example: "Unauthorized"
//  *                     pagination:
//  *                       type: object
//  *                       properties:
//  *                         currentPage:
//  *                           type: integer
//  *                           example: 1
//  *                         totalPages:
//  *                           type: integer
//  *                           example: 3
//  *                         totalRecords:
//  *                           type: integer
//  *                           example: 25
//  *                         limit:
//  *                           type: integer
//  *                           example: 10
//  *                         hasNext:
//  *                           type: boolean
//  *                           example: true
//  *                         hasPrev:
//  *                           type: boolean
//  *                           example: false
//  *       400:
//  *         description: Invalid status parameter
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: "#/components/schemas/ErrorResponse"
//  *       401:
//  *         description: Unauthorized
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: "#/components/schemas/ErrorResponse"
//  *       500:
//  *         description: Internal server error
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: "#/components/schemas/ErrorResponse"
//  */
// router.get('/filter/:status', authenticateToken, getFilteredChequeRequests);

// /**
//  * @swagger
//  * /api/v1/cheque-requests/create:
//  *   post:
//  *     summary: Create cheque book request (brn_user only)
//  *     tags:
//  *       - Cheque Requests
//  *     security:
//  *       - bearerAuth: []
//  *     description: Create a new cheque book request. Only users with group_code 'brn_user' can create requests.
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - cust_ac_no
//  *               - branch_code
//  *               - cheque_book_type
//  *               - number_of_leaves
//  *               - delivery_address
//  *             properties:
//  *               cust_ac_no:
//  *                 type: string
//  *                 example: "0123456789"
//  *                 description: "Customer account number"
//  *               branch_code:
//  *                 type: string
//  *                 example: "001"
//  *                 description: "Branch code"
//  *               cheque_book_type:
//  *                 type: string
//  *                 example: "STANDARD"
//  *                 description: "Type of cheque book"
//  *               number_of_leaves:
//  *                 type: number
//  *                 example: 50
//  *                 description: "Number of cheque leaves"
//  *               delivery_address:
//  *                 type: string
//  *                 example: "123 Main Street, City"
//  *                 description: "Delivery address for cheque book"
//  *               additional_notes:
//  *                 type: string
//  *                 example: "Urgent delivery required"
//  *                 description: "Additional notes (optional)"
//  *     responses:
//  *       201:
//  *         description: Cheque request created successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: true
//  *                 message:
//  *                   type: string
//  *                   example: "Cheque request created successfully"
//  *                 data:
//  *                   type: object
//  *                   properties:
//  *                     id:
//  *                       type: string
//  *                       example: "550e8400-e29b-41d4-a716-446655440000"
//  *                     cust_ac_no:
//  *                       type: string
//  *                       example: "0123456789"
//  *                     branch_code:
//  *                       type: string
//  *                       example: "001"
//  *                     cheque_book_type:
//  *                       type: string
//  *                       example: "STANDARD"
//  *                     number_of_leaves:
//  *                       type: number
//  *                       example: 50
//  *                     delivery_address:
//  *                       type: string
//  *                       example: "123 Main Street, City"
//  *                     additional_notes:
//  *                       type: string
//  *                       example: "Urgent delivery required"
//  *                     auth_status:
//  *                       type: string
//  *                       example: "U"
//  *                     created_by:
//  *                       type: string
//  *                       example: "JOHN.DOE"
//  *       400:
//  *         description: Validation error
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: "#/components/schemas/ErrorResponse"
//  *       401:
//  *         description: Unauthorized - Only brn_user can create requests
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: "#/components/schemas/ErrorResponse"
//  *       500:
//  *         description: Internal server error
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: "#/components/schemas/ErrorResponse"
//  */
// router.post('/create', authenticateToken, createChequeRequest);

// /**
//  * @swagger
//  * /api/v1/cheque-requests/authorize/{id}:
//  *   put:
//  *     summary: Authorize cheque book request (brn_auth only)
//  *     tags:
//  *       - Cheque Requests
//  *     security:
//  *       - bearerAuth: []
//  *     description: Authorize a pending cheque book request. Only users with group_code 'brn_auth' can authorize requests.
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: Cheque request ID
//  *         example: "550e8400-e29b-41d4-a716-446655440000"
//  *     responses:
//  *       200:
//  *         description: Cheque request authorized successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                   example: true
//  *                 message:
//  *                   type: string
//  *                   example: "Cheque request authorized successfully"
//  *                 data:
//  *                   type: object
//  *                   properties:
//  *                     id:
//  *                       type: string
//  *                       example: "550e8400-e29b-41d4-a716-446655440000"
//  *                     auth_status:
//  *                       type: string
//  *                       example: "A"
//  *                     authorized_by:
//  *                       type: string
//  *                       example: "JANE.DOE"
//  *       400:
//  *         description: Validation error
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: "#/components/schemas/ErrorResponse"
//  *       401:
//  *         description: Unauthorized - Only brn_auth can authorize requests
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: "#/components/schemas/ErrorResponse"
//  *       404:
//  *         description: Unauthorized cheque request not found
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: "#/components/schemas/ErrorResponse"
//  *       500:
//  *         description: Internal server error
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: "#/components/schemas/ErrorResponse"
//  */
// router.put('/authorize/:id', authenticateToken, authorizeChequeRequest);

// module.exports = router;