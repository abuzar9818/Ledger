const {Router}=require('express');
const authMiddleware=require('../middleware/authMiddleware');
const transactionController=require('../controller/transactionController');

const transactionRoutes=Router();

//Post /api/transactions - Create a new transaction
transactionRoutes.post('/',authMiddleware.authMiddleware, transactionController.createTransactionController);

//Post /api/transactions/system/initial-fund
transactionRoutes.post('/system/initial-fund',authMiddleware.systemUserMiddleware, transactionController.createInitialFundController);

//Get /api/transactions - Get all transactions for the authenticated user
transactionRoutes.get('/',authMiddleware.authMiddleware, transactionController.getAllTransactions);


module.exports=transactionRoutes;