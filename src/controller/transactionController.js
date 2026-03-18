const transactionModel = require('../models/transactionModel');
const ledgerModel = require('../models/ledgerModel');
const accountModel = require('../models/accountModel');
const emailService = require('../services/emailService');
const mongoose = require('mongoose');


async function createTransactionController(req, res) {

    let session;

    try {

        const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

        if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        if (fromAccount === toAccount) {
            return res.status(400).json({ error: "Cannot transfer to the same account" });
        }

        const transferAmount = Number(amount);

        if (transferAmount <= 0) {
            return res.status(400).json({ error: "Amount must be greater than zero" });
        }

        const fromUserAccount = await accountModel.findById(fromAccount);
        const toUserAccount = await accountModel.findById(toAccount);

        if (!fromUserAccount || !toUserAccount) {
            return res.status(404).json({ error: "Invalid From or To Account" });
        }

        // Idempotency check
        const existingTransaction = await transactionModel.findOne({ idempotencykey: idempotencyKey });

        if (existingTransaction) {

            if (existingTransaction.status === "COMPLETED") {
                return res.status(200).json({
                    message: "Transaction already completed",
                    transaction: existingTransaction
                });
            }

            if (existingTransaction.status === "PENDING") {
                return res.status(200).json({
                    message: "Transaction still processing",
                    transaction: existingTransaction
                });
            }

            return res.status(400).json({
                message: "Previous transaction failed or reversed. Retry with new idempotency key."
            });
        }

        // Account status validation
        if (fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE") {
            return res.status(400).json({
                error: "Both accounts must be ACTIVE"
            });
        }

        // Balance check
        const balance = await fromUserAccount.getBalance();

        if (balance < transferAmount) {
            return res.status(400).json({
                error: `Insufficient balance. Current balance is ${balance}`
            });
        }
        let transaction;
        try{
        // Start DB Transaction
        session = await mongoose.startSession();
        session.startTransaction();

        transaction = (await transactionModel.create([{
            fromaccount: fromAccount,
            toaccount: toAccount,
            amount: transferAmount,
            idempotencykey: idempotencyKey,
            status: "PENDING"
        }], { session }))[0]; 

        // await transaction.save({ session });

        // Debit Ledger
        await ledgerModel.create([{
            account: fromAccount,
            amount: transferAmount,
            transaction: transaction._id,
            type: "DEBIT"
        }], { session });

        await (() => {
    return new Promise((resolve) => {
        setTimeout(resolve, 15 * 1000);
    });
})();

        // Credit Ledger
        await ledgerModel.create([{
            account: toAccount,
            amount: transferAmount,
            transaction: transaction._id,
            type: "CREDIT"
        }], { session });

        // Complete Transaction
        // transaction.status = "COMPLETED";
        // await transaction.save({ session });

        await transactionModel.findOneAndUpdate(
            { _id: transaction._id },
            { status: "COMPLETED" },
            { session}
        );

        await session.commitTransaction();
        session.endSession();
    } catch (error) {
        await transactionModel.findOneAndUpdate(
            { idempotencykey:idempotencyKey },
            { status: "FAILED" }
        )
        return res.status(500).json({
            error: "Transaction failed try after some time"

        });
    }

        // Send Emails (async)
        try {

            emailService.sendTransactionEmail(
                fromUserAccount.email,
                "Transaction Successful",
                `Your transaction of ₹${transferAmount} was successful.`,
                `<p>Your transaction of <strong>₹${transferAmount}</strong> was successful.</p>`
            );

            emailService.sendTransactionEmail(
                toUserAccount.email,
                "Incoming Transaction",
                `You received ₹${transferAmount}.`,
                `<p>You received <strong>₹${transferAmount}</strong>.</p>`
            );

        } catch (emailError) {
            console.error("Email failed:", emailError);
        }

        return res.status(201).json({
            message: "Transaction completed successfully",
            transaction
        });

    } catch (error) {

        if (session) {
            await session.abortTransaction();
            session.endSession();
        }

        console.error(error);

        return res.status(500).json({
            error: "Transaction failed"
        });
    }
}



async function createInitialFundController(req, res) {

    let session;

    try {

        const { toAccount, amount, idempotencyKey } = req.body;

        if (!toAccount || !amount || !idempotencyKey) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const transferAmount = Number(amount);

        const toUserAccount = await accountModel.findById(toAccount);

        if (!toUserAccount) {
            return res.status(400).json({ error: "Invalid To Account" });
        }

        const fromUserAccount = await accountModel.findOne({
            user: req.user._id
        });

        if (!fromUserAccount) {
            return res.status(400).json({
                error: "System account not found"
            });
        }

        session = await mongoose.startSession();
        session.startTransaction();

        const transaction = new transactionModel({
            fromaccount: fromUserAccount._id,
            toaccount: toAccount,
            amount: transferAmount,
            idempotencykey: idempotencyKey,
            status: "PENDING"
        });

        await transaction.save({ session });

        await ledgerModel.create([{
            account: fromUserAccount._id,
            amount: transferAmount,
            transaction: transaction._id,
            type: "DEBIT"
        }], { session });

        await ledgerModel.create([{
            account: toAccount,
            amount: transferAmount,
            transaction: transaction._id,
            type: "CREDIT"
        }], { session });

        transaction.status = "COMPLETED";
        await transaction.save({ session });

        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({
            message: "Initial fund added successfully",
            transaction
        });

    } catch (error) {

        if (session) {
            await session.abortTransaction();
            session.endSession();
        }

        console.error(error);

        return res.status(500).json({
            error: "Initial fund failed"
        });
    }
}

async function getMyTransactions(req, res) {
    try {

        const { page = 1, limit = 10 } = req.query;

        const skip = (page - 1) * limit;

        // Get user's accounts
        const userAccounts = await accountModel.find({
            user: req.user._id
        }).select('_id');

        const accountIds = userAccounts.map(acc => acc._id);

        const transactions = await transactionModel.find({
            $or: [
                { fromaccount: { $in: accountIds } },
                { toaccount: { $in: accountIds } }
            ]
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean();

        const total = await transactionModel.countDocuments({
            $or: [
                { fromaccount: { $in: accountIds } },
                { toaccount: { $in: accountIds } }
            ]
        });

        res.status(200).json({
            page: Number(page),
            totalPages: Math.ceil(total / limit),
            total,
            transactions
        });

    } catch (error) {
        res.status(500).json({
            error: "Failed to fetch transactions"
        });
    }
}

async function reverseTransaction(req, res) {

    let session;

    try {
        const { id } = req.params;

        const originalTx = await transactionModel.findById(id);

        if (!originalTx) {
            return res.status(404).json({ error: "Transaction not found" });
        }

        // Get user's accounts
        const userAccounts = await accountModel.find({
            user: req.user._id
        }).select('_id');

        const accountIds = userAccounts.map(acc => acc._id.toString());

        // Only the logged-in user who performed (from account) the transaction can reverse it.
        if (!accountIds.includes(originalTx.fromaccount.toString())) {
            return res.status(403).json({
                error: "Only the transaction initiator can reverse this transaction"
            });
        }

        // Allow reversal only within 1 minute from transaction creation.
        const oneMinuteMs = 60 * 1000;
        const transactionAge = Date.now() - new Date(originalTx.createdAt).getTime();

        if (transactionAge > oneMinuteMs) {
            return res.status(400).json({
                error: "Reversal window expired. Transactions can only be reversed within 1 minute"
            });
        }

        if (originalTx.status !== "COMPLETED") {
            return res.status(400).json({
                error: "Only completed transactions can be reversed"
            });
        }

        // Prevent double reversal
        const alreadyReversed = await transactionModel.findOne({
            reversedTransaction: id
        });

        if (alreadyReversed) {
            return res.status(400).json({
                error: "Transaction already reversed"
            });
        }

        // Check account status
        const fromAcc = await accountModel.findById(originalTx.fromaccount);
        const toAcc = await accountModel.findById(originalTx.toaccount);

        if (!fromAcc || !toAcc) {
            return res.status(404).json({
                error: "Associated account not found"
            });
        }

        if (fromAcc.status !== "ACTIVE" || toAcc.status !== "ACTIVE") {
            return res.status(400).json({
                error: "Accounts must be ACTIVE to reverse"
            });
        }

        session = await mongoose.startSession();
        session.startTransaction();

        // Create reversal transaction
        const reversalTx = (await transactionModel.create([{
            fromaccount: originalTx.toaccount,
            toaccount: originalTx.fromaccount,
            amount: originalTx.amount,
            status: "COMPLETED",
            idempotencykey: `reverse-${Date.now()}`,
            reversedTransaction: originalTx._id
        }], { session }))[0];

        // Reverse ledger entries
        await ledgerModel.create([
            {
                account: originalTx.toaccount,
                amount: originalTx.amount,
                transaction: reversalTx._id,
                type: "DEBIT"
            },
            {
                account: originalTx.fromaccount,
                amount: originalTx.amount,
                transaction: reversalTx._id,
                type: "CREDIT"
            }
        ], { session, ordered: true });

        // Update original
        await transactionModel.findByIdAndUpdate(
            id,
            { status: "REVERSED" },
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            message: "Transaction reversed successfully",
            reversalTx
        });

    } catch (error) {

        if (session) {
            await session.abortTransaction();
            session.endSession();
        }

        console.error("Reverse transaction error:", error);

        return res.status(500).json({
            error: "Reversal failed",
            details: error.message
        });
    }
}

module.exports = {
    createTransactionController,
    createInitialFundController,
    getMyTransactions,
    reverseTransaction
};