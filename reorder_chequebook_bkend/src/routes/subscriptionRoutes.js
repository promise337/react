const express = require('express');
const router = express.Router();
const { subscribeCustomer, unsubscribeCustomer, getAllSubscriptions, getSubscriptionsByStatus, updateSubscription } = require('../controller/subscriptionController');
const { authenticateToken } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/v1/subscriptions:
 *   get:
 *     summary: Get all subscriptions with pagination
 *     tags:
 *       - Subscriptions
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve all customer subscriptions with pagination
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of records per page
 *     responses:
 *       200:
 *         description: Subscriptions retrieved successfully
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
 *                   example: "Subscriptions retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     subscriptions:
 *                       type: array
 *                       items:
 *                         type: object
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         currentPage:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *                         totalRecords:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                         hasNext:
 *                           type: boolean
 *                         hasPrev:
 *                           type: boolean
 *       401:
 *         description: Unauthorized
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
router.get('/', authenticateToken, getAllSubscriptions);

/**
 * @swagger
 * /api/v1/subscriptions/filter/{status}:
 *   get:
 *     summary: Get subscriptions by status filter
 *     tags:
 *       - Subscriptions
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve subscriptions filtered by subscription status (Y for subscribed, N for unsubscribed)
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: ["Y", "N"]
 *         description: Subscription status (Y = subscribed, N = unsubscribed)
 *         example: "Y"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of records per page
 *     responses:
 *       200:
 *         description: Filtered subscriptions retrieved successfully
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
 *                   example: "Subscribed customers retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     subscriptions:
 *                       type: array
 *                       items:
 *                         type: object
 *                     filter:
 *                       type: object
 *                       properties:
 *                         status:
 *                           type: string
 *                           example: "Y"
 *                         statusDescription:
 *                           type: string
 *                           example: "Subscribed"
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         currentPage:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *                         totalRecords:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                         hasNext:
 *                           type: boolean
 *                         hasPrev:
 *                           type: boolean
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       401:
 *         description: Unauthorized
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
router.get('/filter/:status', authenticateToken, getSubscriptionsByStatus);

/**
 * @swagger
 * /api/v1/subscriptions/subscribe:
 *   post:
 *     summary: Subscribe customer for cheque book reorder notifications
 *     tags:
 *       - Subscriptions
 *     security:
 *       - bearerAuth: []
 *     description: Create a subscription for customer cheque book reorder notifications
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cust_ac_no
 *               - branch_code
 *               - reorder_threshold_number
 *               - subscribed
 *               - notify_sms
 *               - notify_email
 *               - notify_rm
 *             properties:
 *               cust_ac_no:
 *                 type: string
 *                 example: "0123456789"
 *                 description: "Customer account number"
 *               branch_code:
 *                 type: string
 *                 example: "001"
 *                 description: "Branch code"
 *               reorder_threshold_number:
 *                 type: number
 *                 example: 10
 *                 description: "Threshold number for reorder notification"
 *               subscribed:
 *                 type: string
 *                 enum: ["Y", "N"]
 *                 example: "Y"
 *                 description: "Subscription status (Y/N)"
 *               notify_sms:
 *                 type: string
 *                 enum: ["Y", "N"]
 *                 example: "Y"
 *                 description: "SMS notification preference (Y/N)"
 *               notify_email:
 *                 type: string
 *                 enum: ["Y", "N"]
 *                 example: "Y"
 *                 description: "Email notification preference (Y/N)"
 *               notify_rm:
 *                 type: string
 *                 enum: ["Y", "N"]
 *                 example: "N"
 *                 description: "RM notification preference (Y/N)"
 *     responses:
 *       201:
 *         description: Customer subscription created successfully
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
 *                   example: "Customer subscription created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "550e8400-e29b-41d4-a716-446655440000"
 *                       description: "Generated UUID"
 *                     cust_ac_no:
 *                       type: string
 *                       example: "0123456789"
 *                     branch_code:
 *                       type: string
 *                       example: "001"
 *                     reorder_threshold_number:
 *                       type: number
 *                       example: 10
 *                     subscribed:
 *                       type: string
 *                       example: "Y"
 *                     notify_sms:
 *                       type: string
 *                       example: "Y"
 *                     notify_email:
 *                       type: string
 *                       example: "Y"
 *                     notify_rm:
 *                       type: string
 *                       example: "N"
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
 *       401:
 *         description: Unauthorized
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
router.post('/subscribe', authenticateToken, subscribeCustomer);

/**
 * @swagger
 * /api/v1/subscriptions/unsubscribe/{cust_ac_no}:
 *   put:
 *     summary: Unsubscribe customer from cheque book reorder notifications
 *     tags:
 *       - Subscriptions
 *     security:
 *       - bearerAuth: []
 *     description: Unsubscribe customer by setting subscribed to N and all notification preferences to N
 *     parameters:
 *       - in: path
 *         name: cust_ac_no
 *         required: true
 *         schema:
 *           type: string
 *         description: Customer account number
 *         example: "0123456789"
 *     responses:
 *       200:
 *         description: Customer unsubscribed successfully
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
 *                   example: "Customer unsubscribed successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     cust_ac_no:
 *                       type: string
 *                       example: "0123456789"
 *                     subscribed:
 *                       type: string
 *                       example: "N"
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
 *                     cust_ac_no:
 *                       type: string
 *                       example: "Customer account number is required"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       404:
 *         description: Customer subscription not found
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
router.put('/unsubscribe/:cust_ac_no', authenticateToken, unsubscribeCustomer);

/**
 * @swagger
 * /api/v1/subscriptions/{cust_ac_no}:
 *   put:
 *     summary: Update subscription details
 *     tags:
 *       - Subscriptions
 *     security:
 *       - bearerAuth: []
 *     description: Update subscription details for a customer account
 *     parameters:
 *       - in: path
 *         name: cust_ac_no
 *         required: true
 *         schema:
 *           type: string
 *         description: Customer account number
 *         example: "0123456789"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               branch_code:
 *                 type: string
 *                 example: "001"
 *                 description: "Branch code"
 *               reorder_threshold_number:
 *                 type: number
 *                 example: 10
 *                 description: "Threshold number for reorder notification"
 *               subscribed:
 *                 type: string
 *                 enum: ["Y", "N"]
 *                 example: "Y"
 *                 description: "Subscription status (Y/N)"
 *               notify_sms:
 *                 type: string
 *                 enum: ["Y", "N"]
 *                 example: "Y"
 *                 description: "SMS notification preference (Y/N)"
 *               notify_email:
 *                 type: string
 *                 enum: ["Y", "N"]
 *                 example: "Y"
 *                 description: "Email notification preference (Y/N)"
 *               notify_rm:
 *                 type: string
 *                 enum: ["Y", "N"]
 *                 example: "N"
 *                 description: "RM notification preference (Y/N)"
 *     responses:
 *       200:
 *         description: Subscription updated successfully
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
 *                   example: "Subscription updated successfully"
 *                 data:
 *                   type: object
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
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       404:
 *         description: Customer subscription not found
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
router.put('/:cust_ac_no', authenticateToken, updateSubscription);

module.exports = router;