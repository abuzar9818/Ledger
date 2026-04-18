const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const accountController = require('../controller/accountController');


const router = express.Router();

//Post api/accounts/create // Protected route
router.post('/', authMiddleware.authMiddleware, accountController.createAccountController);

//Get api/accounts/ // Protected route
router.get('/', authMiddleware.authMiddleware, accountController.getUserAccountsController);

//Get api/accounts/balance/:accountId // Protected route
router.get('/balance/:accountId', authMiddleware.authMiddleware, accountController.getAccountBalanceController);


module.exports = router;