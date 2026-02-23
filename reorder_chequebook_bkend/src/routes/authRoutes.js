const express = require('express');
const router = express.Router();
const { login } = require('../controller/authController');

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Bank Staff login
 *     tags:
 *       - Authentication
 *     description: Authenticate user with username and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/LoginRequest"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/LoginResponse"
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
 *                     username:
 *                       type: string
 *                       example: "Username is required"
 *                     password:
 *                       type: string
 *                       example: "Password is required"
 *       404:
 *         description: User not found
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
router.post('/login', login);

module.exports = router;