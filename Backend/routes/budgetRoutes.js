const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const budgetController = require('../controller/budgetController');

const router = express.Router();

router.post('/', authMiddleware.authMiddleware, budgetController.upsertBudget);
router.get('/progress', authMiddleware.authMiddleware, budgetController.getBudgetProgress);

module.exports = router;
