// const express = require('express');
// const router = express.Router();
// const { getAllUsers } = require('../controller/userController');
// const { authenticateToken } = require('../middleware/authMiddleware');

// /**
//  * @swagger
//  * /api/v1/users:
//  *   get:
//  *     summary: Get all users
//  *     tags:
//  *       - Users
//  *     security:
//  *       - bearerAuth: []
//  *     description: Fetch all users with username, fullname, branch_code, user_status and session_token
//  *     responses:
//  *       200:
//  *         description: Users retrieved successfully
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
//  *                   example: "Users retrieved successfully"
//  *                 data:
//  *                   type: array
//  *                   items:
//  *                     type: object
//  *                     properties:
//  *                       USERNAME:
//  *                         type: string
//  *                         example: "john_doe"
//  *                       FULLNAME:
//  *                         type: string
//  *                         example: "John Doe"
//  *                       GROUP_CODE:
//  *                         type: string
//  *                         example: "brn_user"
//  *                       BRANCH_CODE:
//  *                         type: string
//  *                         example: "BR001"
//  *                       USER_STATUS:
//  *                         type: string
//  *                         example: "A"
//  *                 count:
//  *                   type: integer
//  *                   example: 25
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
// router.get('/', authenticateToken, getAllUsers);

// module.exports = router;