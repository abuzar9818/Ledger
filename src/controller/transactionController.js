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

        // Start DB Transaction
        session = await mongoose.startSession();
        session.startTransaction();

        const transaction = new transactionModel({
            fromaccount: fromAccount,
            toaccount: toAccount,
            amount: transferAmount,
            idempotencykey: idempotencyKey,
            status: "PENDING"
        });

        await transaction.save({ session });

        // Debit Ledger
        await ledgerModel.create([{
            account: fromAccount,
            amount: transferAmount,
            transaction: transaction._id,
            type: "DEBIT"
        }], { session });

        // Credit Ledger
        await ledgerModel.create([{
            account: toAccount,
            amount: transferAmount,
            transaction: transaction._id,
            type: "CREDIT"
        }], { session });

        // Complete Transaction
        transaction.status = "COMPLETED";
        await transaction.save({ session });

        await session.commitTransaction();
        session.endSession();

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


module.exports = {
    createTransactionController,
    createInitialFundController
};