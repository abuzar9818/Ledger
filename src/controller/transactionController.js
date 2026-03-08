const transactionModel=require('../models/transactionModel');





async function createTransactionController(req, res) {

    const { fromAccount, toAccount, amount, idempotencyKey  } = req.body;

    if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({ error: "Missing required fields" });
    }
}