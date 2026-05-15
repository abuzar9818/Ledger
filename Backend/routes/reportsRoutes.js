const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const reportsController = require('../controller/reportsController');

const router = express.Router();

router.get('/monthly-summary', authMiddleware.authMiddleware, reportsController.getMonthlySummary);
router.get('/dashboard-analytics', authMiddleware.authMiddleware, reportsController.getDashboardAnalytics);

module.exports = router;
