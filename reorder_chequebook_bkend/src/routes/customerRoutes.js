const express = require('express');
const router = express.Router();
const { searchCustomer } = require('../controller/customerController');
const { authenticateToken } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/v1/customers/{accountNumber}:
 *   get:
 *     summary: Search customer by account number (only customers that are eligible to request for a cheque book)
 *     tags:
 *       - Customers
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve customer details with their account number
 *     parameters:
 *       - in: path
 *         name: accountNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: Customer account number
 *         example: "0123456789"
 *     responses:
 *       200:
 *         description: Customer details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Customer details retrieved successfully"
 *                 data:
 *                   type: object
 *                   description: "Customer account details"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Validation failed"
 *                 errors:
 *                   type: object
 *                   properties:
 *                     accountNumber:
 *                       type: string
 *                       example: "Account number is required"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       404:
 *         description: Customer account not found or is not eligbile to request for a cheque
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.get('/:accountNumber', authenticateToken, searchCustomer);

module.exports = router;