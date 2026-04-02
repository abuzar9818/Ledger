const { Router } = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const rateLimitMiddleware = require('../middleware/rateLimitMiddleware');
const scheduledTransactionController = require('../controller/scheduledTransactionController');

const scheduledTransactionRoutes = Router();

scheduledTransactionRoutes.use(rateLimitMiddleware.transactionLimiter);

scheduledTransactionRoutes.post(
    '/',
    authMiddleware.authMiddleware,
    scheduledTransactionController.createScheduledTransaction
);

scheduledTransactionRoutes.get(
    '/my-schedules',
    authMiddleware.authMiddleware,
    scheduledTransactionController.getMyScheduledTransactions
);

module.exports = scheduledTransactionRoutes;
