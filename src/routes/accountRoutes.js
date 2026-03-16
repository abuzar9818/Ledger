const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const accountController = require('../controller/accountController');


const router = express.Router();

//Post api/accounts/create // Protected route
router.post('/', authMiddleware.authMiddleware, accountController.createAccountController);

//Get api/accounts/ // Protected route
router.get('/', authMiddleware.authMiddleware, accountController.getUserAccountsController);


module.exports = router;