const {Router}=require('express');
const authMiddleware=require('../middleware/authMiddleware');
const transactionContoller=require('../controller/transactionController');

const transactionRoutes=Router();

//Post /api/transactions - Create a new transaction
transactionRoutes.post('/',authMiddleware.authMiddleware, transactionContoller.createTransactionController);

//Post /api/transactions/system/initial-fund
transactionRoutes.post('/system/initial-fund',authMiddleware.authMiddleware, authMiddleware.systemUserMiddleware, transactionContoller.createInitialFundController);

module.exports=transactionRoutes;