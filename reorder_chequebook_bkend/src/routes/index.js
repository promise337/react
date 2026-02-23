const express = require('express');
const router = express.Router();

// Import route modules
// const userRoutes = require('./userRoutes');
const authRoutes = require('./authRoutes');
const customerRoutes = require('./customerRoutes');
const subscriptionRoutes = require('./subscriptionRoutes');
// const chequeRequestRoutes = require('./chequeRequestRoutes');

// Define route prefixes
// router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/customers', customerRoutes);
router.use('/subscriptions', subscriptionRoutes);
// router.use('/cheque-requests', chequeRequestRoutes);

module.exports = router;