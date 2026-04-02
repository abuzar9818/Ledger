const accountModel = require('../models/accountModel');
const scheduledTransactionModel = require('../models/scheduledTransactionModel');

async function createScheduledTransaction(req, res) {
    try {
        const { fromAccount, toAccount, amount, recurrence, startDate } = req.body;

        if (!fromAccount || !toAccount || !amount || !recurrence) {
            return res.status(400).json({
                message: 'Missing required fields',
                status: 'failed'
            });
        }

        if (fromAccount === toAccount) {
            return res.status(400).json({
                message: 'Cannot transfer to the same account',
                status: 'failed'
            });
        }

        const transferAmount = Number(amount);

        if (transferAmount <= 0) {
            return res.status(400).json({
                message: 'Amount must be greater than zero',
                status: 'failed'
            });
        }

        const normalizedRecurrence = String(recurrence).toUpperCase();
        const validRecurrence = ['DAILY', 'WEEKLY', 'MONTHLY'];

        if (!validRecurrence.includes(normalizedRecurrence)) {
            return res.status(400).json({
                message: 'Invalid recurrence. Allowed values: DAILY, WEEKLY, MONTHLY',
                status: 'failed'
            });
        }

        const fromUserAccount = await accountModel.findById(fromAccount);
        const toUserAccount = await accountModel.findById(toAccount);

        if (!fromUserAccount || !toUserAccount) {
            return res.status(404).json({
                message: 'Invalid from or to account',
                status: 'failed'
            });
        }

        if (fromUserAccount.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: 'You can only schedule transactions from your own account',
                status: 'failed'
            });
        }

        if (fromUserAccount.status !== 'ACTIVE' || toUserAccount.status !== 'ACTIVE') {
            return res.status(400).json({
                message: 'Both accounts must be ACTIVE',
                status: 'failed'
            });
        }

        let nextRunAt = new Date();

        if (startDate) {
            const parsedStartDate = new Date(startDate);
            if (Number.isNaN(parsedStartDate.getTime())) {
                return res.status(400).json({
                    message: 'Invalid startDate',
                    status: 'failed'
                });
            }
            nextRunAt = parsedStartDate;
        }

        const scheduledTransaction = await scheduledTransactionModel.create({
            userId: req.user._id,
            fromaccount: fromAccount,
            toaccount: toAccount,
            amount: transferAmount,
            recurrence: normalizedRecurrence,
            status: 'PENDING',
            nextRunAt
        });

        return res.status(201).json({
            message: 'Scheduled transaction created successfully',
            status: 'success',
            scheduledTransaction
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to create scheduled transaction',
            status: 'failed'
        });
    }
}

async function getMyScheduledTransactions(req, res) {
    try {
        const schedules = await scheduledTransactionModel
            .find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({
            status: 'success',
            schedules
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to fetch scheduled transactions',
            status: 'failed'
        });
    }
}

module.exports = {
    createScheduledTransaction,
    getMyScheduledTransactions
};
