const transactionModel = require('../models/transactionModel');
const ledgerModel = require('../models/ledgerModel');
const accountModel = require('../models/accountModel');
const emailService = require('../services/emailService');
const auditLogService = require('../services/auditLogService');
const mongoose = require('mongoose');

const MAX_TRANSACTION_LIMIT = 50000;
const DAILY_TRANSACTION_LIMIT = 100000;
const TRANSACTION_CATEGORIES = ['FOOD', 'RENT', 'SALARY', 'TRANSFER', 'OTHER'];


async function createTransactionController(req, res) {

    let session;

    try {

        if (!req.user?._id) {
            return res.status(401).json({ error: "You need to login" });
        }

        const { fromAccount, toAccount, amount, idempotencyKey, category } = req.body;

        if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        if (fromAccount === toAccount) {
            return res.status(400).json({ error: "Cannot transfer to the same account" });
        }

        const transferAmount = Number(amount);
        const normalizedCategory = category ? String(category).toUpperCase() : 'TRANSFER';

        if (!TRANSACTION_CATEGORIES.includes(normalizedCategory)) {
            return res.status(400).json({ error: "Invalid transaction category" });
        }

        if (transferAmount <= 0) {
            return res.status(400).json({ error: "Amount must be greater than zero" });
        }

        if (transferAmount > MAX_TRANSACTION_LIMIT) {
            return res.status(400).json({
                error: `Max transaction limit exceeded. Maximum allowed is ${MAX_TRANSACTION_LIMIT}`
            });
        }

        const fromUserAccount = await accountModel.findById(fromAccount);
        const toUserAccount = await accountModel.findById(toAccount);

        if (!fromUserAccount || !toUserAccount) {
            return res.status(404).json({ error: "Invalid From or To Account" });
        }

        if (fromUserAccount.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                error: "You can only perform transactions from your own account"
            });
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

        const dayStart = new Date();
        dayStart.setHours(0, 0, 0, 0);

        const dayEnd = new Date();
        dayEnd.setHours(23, 59, 59, 999);

        const dailyVolumeResult = await transactionModel.aggregate([
            {
                $match: {
                    fromaccount: new mongoose.Types.ObjectId(fromAccount),
                    status: { $in: ["PENDING", "COMPLETED"] },
                    createdAt: { $gte: dayStart, $lte: dayEnd }
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);

        const todayUsedAmount = dailyVolumeResult[0]?.totalAmount || 0;
        const projectedDailyVolume = todayUsedAmount + transferAmount;

        if (projectedDailyVolume > DAILY_TRANSACTION_LIMIT) {
            return res.status(400).json({ error: "Daily limit exceeded" });
        }

        let transaction;
        try {
            // Start DB Transaction
            session = await mongoose.startSession();
            session.startTransaction();

            transaction = (await transactionModel.create([{
                fromaccount: fromAccount,
                toaccount: toAccount,
                amount: transferAmount,
                category: normalizedCategory,
                idempotencykey: idempotencyKey,
                dailyvolume: projectedDailyVolume,
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
                { session }
            );

            await session.commitTransaction();
            session.endSession();

            try {

                await emailService.sendTransactionEmail(
                    fromUserAccount.email,
                    "Transaction Successful",
                    `Your transaction of ₹${transferAmount} was successful.`,
                    `<p>Your transaction of <strong>₹${transferAmount}</strong> was successful.</p>`
                );

                await emailService.sendTransactionEmail(
                    toUserAccount.email,
                    "Incoming Transaction",
                    `You received ₹${transferAmount}.`,
                    `<p>You received <strong>₹${transferAmount}</strong>.</p>`
                );

            } catch (error) {
                console.log("Success email failed");
            }
        } catch (error) {

            if (transaction?._id) {
                await transactionModel.findByIdAndUpdate(
                    transaction._id,
                    { status: "FAILED" }
                );
            }

            try {

                await emailService.sendTransactionFailureEmail(
                    fromUserAccount.email,
                    "Transaction Failed",
                    `Your transaction of ₹${transferAmount} failed.`,
                    `<p>Your transaction of <strong>₹${transferAmount}</strong> failed.</p>`
                );

            } catch (error) {
                console.log("Failure email failed");
            }

            return res.status(500).json({
                error: "Transaction failed"
            });
        }

        await auditLogService.logAuditEvent({
            userId: req.user._id,
            actionType: 'TRANSFER',
            metadata: {
                transactionId: transaction._id,
                amount: transferAmount,
                fromAccount,
                toAccount
            }
        });

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
            category: 'SALARY',
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

        const {
            page = 1,
            limit = 10,
            status,
            category,
            startDate,
            endDate,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
        const limitNumber = Math.max(parseInt(limit, 10) || 10, 1);
        const skip = (pageNumber - 1) * limitNumber;

        const validStatus = ['PENDING', 'COMPLETED', 'FAILED', 'REVERSED'];
        const validSortFields = ['amount', 'createdAt'];

        if (status && !validStatus.includes(String(status).toUpperCase())) {
            return res.status(400).json({
                error: 'Invalid status filter'
            });
        }

        if (category && !TRANSACTION_CATEGORIES.includes(String(category).toUpperCase())) {
            return res.status(400).json({
                error: 'Invalid category filter'
            });
        }

        if (!validSortFields.includes(sortBy)) {
            return res.status(400).json({
                error: 'Invalid sortBy. Allowed values: amount, createdAt'
            });
        }

        const normalizedSortOrder = String(sortOrder).toLowerCase() === 'asc' ? 1 : -1;

        const createdAtFilter = {};

        if (startDate) {
            const parsedStartDate = new Date(startDate);
            if (Number.isNaN(parsedStartDate.getTime())) {
                return res.status(400).json({
                    error: 'Invalid startDate'
                });
            }
            createdAtFilter.$gte = parsedStartDate;
        }

        if (endDate) {
            const parsedEndDate = new Date(endDate);
            if (Number.isNaN(parsedEndDate.getTime())) {
                return res.status(400).json({
                    error: 'Invalid endDate'
                });
            }
            createdAtFilter.$lte = parsedEndDate;
        }

        if (createdAtFilter.$gte && createdAtFilter.$lte && createdAtFilter.$gte > createdAtFilter.$lte) {
            return res.status(400).json({
                error: 'startDate cannot be greater than endDate'
            });
        }

        // Get user's accounts
        const userAccounts = await accountModel.find({
            user: req.user._id
        }).select('_id');

        const accountIds = userAccounts.map(acc => acc._id);

        const queryFilter = {
            $or: [
                { fromaccount: { $in: accountIds } },
                { toaccount: { $in: accountIds } }
            ]
        };

        if (status) {
            queryFilter.status = String(status).toUpperCase();
        }

        if (category) {
            queryFilter.category = String(category).toUpperCase();
        }

        if (Object.keys(createdAtFilter).length > 0) {
            queryFilter.createdAt = createdAtFilter;
        }

        const transactions = await transactionModel.find(queryFilter)
            .sort({ [sortBy]: normalizedSortOrder })
            .skip(skip)
            .limit(limitNumber)
            .lean();

        const totalRecords = await transactionModel.countDocuments(queryFilter);
        const totalPages = totalRecords === 0 ? 0 : Math.ceil(totalRecords / limitNumber);

        res.status(200).json({
            totalRecords,
            totalPages,
            currentPage: pageNumber,
            transactions
        });

    } catch (error) {
        res.status(500).json({
            error: "Failed to fetch transactions"
        });
    }
}

async function getTransactionsByCategory(req, res) {
    try {
        const { category } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const normalizedCategory = String(category).toUpperCase();

        if (!TRANSACTION_CATEGORIES.includes(normalizedCategory)) {
            return res.status(400).json({
                error: 'Invalid transaction category'
            });
        }

        const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
        const limitNumber = Math.max(parseInt(limit, 10) || 10, 1);
        const skip = (pageNumber - 1) * limitNumber;

        const userAccounts = await accountModel.find({
            user: req.user._id
        }).select('_id');

        const accountIds = userAccounts.map(acc => acc._id);

        const queryFilter = {
            category: normalizedCategory,
            $or: [
                { fromaccount: { $in: accountIds } },
                { toaccount: { $in: accountIds } }
            ]
        };

        const transactions = await transactionModel.find(queryFilter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNumber)
            .lean();

        const totalRecords = await transactionModel.countDocuments(queryFilter);
        const totalPages = totalRecords === 0 ? 0 : Math.ceil(totalRecords / limitNumber);

        return res.status(200).json({
            category: normalizedCategory,
            totalRecords,
            totalPages,
            currentPage: pageNumber,
            transactions
        });
    } catch (error) {
        return res.status(500).json({
            error: 'Failed to fetch transactions by category'
        });
    }
}

async function getTransactionStatus(req, res) {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid transaction id" });
        }

        const transaction = await transactionModel.findById(id).lean();

        if (!transaction) {
            return res.status(404).json({ error: "Transaction not found" });
        }

        const userAccounts = await accountModel.find({
            user: req.user._id
        }).select('_id');

        const accountIds = userAccounts.map(acc => acc._id.toString());

        const hasAccess =
            accountIds.includes(transaction.fromaccount.toString()) ||
            accountIds.includes(transaction.toaccount.toString());

        if (!hasAccess) {
            return res.status(403).json({ error: "Unauthorized to view this transaction status" });
        }

        return res.status(200).json({
            transactionId: transaction._id,
            status: transaction.status
        });
    } catch (error) {
        return res.status(500).json({
            error: "Failed to fetch transaction status"
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
            category: 'TRANSFER',
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

        await auditLogService.logAuditEvent({
            userId: req.user._id,
            actionType: 'REVERSAL',
            metadata: {
                originalTransactionId: originalTx._id,
                reversalTransactionId: reversalTx._id,
                amount: originalTx.amount,
                fromAccount: originalTx.fromaccount,
                toAccount: originalTx.toaccount
            }
        });

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
    getTransactionsByCategory,
    getTransactionStatus,
    reverseTransaction
};