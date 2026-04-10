const {Router}=require('express');
const authMiddleware=require('../middleware/authMiddleware');
const rateLimitMiddleware=require('../middleware/rateLimitMiddleware');
const transactionController=require('../controller/transactionController');

const transactionRoutes=Router();

transactionRoutes.use(rateLimitMiddleware.transactionLimiter);

//Post /api/transactions - Create a new transaction
transactionRoutes.post('/',authMiddleware.authMiddleware, transactionController.createTransactionController);

//Post /api/transactions/system/initial-fund
transactionRoutes.post(
	'/system/initial-fund',
	authMiddleware.authMiddleware,
	authMiddleware.adminMiddleware,
	transactionController.createInitialFundController
);

//Get /api/transactions/my-transactions?page=1&limit=10
transactionRoutes.get('/my-transactions', authMiddleware.authMiddleware, transactionController.getMyTransactions);

//Get /api/transactions/category/:category
transactionRoutes.get('/category/:category', authMiddleware.authMiddleware, transactionController.getTransactionsByCategory);

//Get /api/transactions/:id/status
transactionRoutes.get('/:id/status', authMiddleware.authMiddleware, transactionController.getTransactionStatus);

//Post /api/transactions/:id/reverse
transactionRoutes.post('/:id/reverse', authMiddleware.authMiddleware, transactionController.reverseTransaction);


module.exports=transactionRoutes;