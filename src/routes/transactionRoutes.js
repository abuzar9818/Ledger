const {Router}=require('express');
const authMiddleware=require('../middleware/authMiddleware');

const transactionRoutes=Router();

//Post /api/transactions - Create a new transaction
transactionRoutes.post('/',authMiddleware.authMiddleware);

module.exports=transactionRoutes;