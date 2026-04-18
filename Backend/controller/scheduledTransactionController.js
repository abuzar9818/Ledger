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

async function updateScheduledTransaction(req, res) {
    try {
        const { id } = req.params;
        const { fromAccount, toAccount, amount, recurrence, startDate } = req.body;

        const schedule = await scheduledTransactionModel.findById(id);

        if (!schedule) {
            return res.status(404).json({
                message: 'Scheduled transaction not found',
                status: 'failed'
            });
        }

        if (schedule.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: 'You can only edit your own scheduled transactions',
                status: 'failed'
            });
        }

        if (schedule.status !== 'PENDING') {
            return res.status(400).json({
                message: 'Only PENDING schedules can be edited',
                status: 'failed'
            });
        }

        if (new Date(schedule.nextRunAt).getTime() <= Date.now()) {
            return res.status(400).json({
                message: 'Only future schedules can be edited',
                status: 'failed'
            });
        }

        const nextFromAccount = fromAccount || schedule.fromaccount.toString();
        const nextToAccount = toAccount || schedule.toaccount.toString();

        if (nextFromAccount === nextToAccount) {
            return res.status(400).json({
                message: 'Cannot transfer to the same account',
                status: 'failed'
            });
        }

        const fromUserAccount = await accountModel.findById(nextFromAccount);
        const toUserAccount = await accountModel.findById(nextToAccount);

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

        if (amount !== undefined) {
            const transferAmount = Number(amount);

            if (transferAmount <= 0) {
                return res.status(400).json({
                    message: 'Amount must be greater than zero',
                    status: 'failed'
                });
            }

            schedule.amount = transferAmount;
        }

        if (recurrence !== undefined) {
            const normalizedRecurrence = String(recurrence).toUpperCase();
            const validRecurrence = ['DAILY', 'WEEKLY', 'MONTHLY'];

            if (!validRecurrence.includes(normalizedRecurrence)) {
                return res.status(400).json({
                    message: 'Invalid recurrence. Allowed values: DAILY, WEEKLY, MONTHLY',
                    status: 'failed'
                });
            }

            schedule.recurrence = normalizedRecurrence;
        }

        if (startDate !== undefined) {
            const parsedStartDate = new Date(startDate);

            if (Number.isNaN(parsedStartDate.getTime())) {
                return res.status(400).json({
                    message: 'Invalid startDate',
                    status: 'failed'
                });
            }

            if (parsedStartDate.getTime() <= Date.now()) {
                return res.status(400).json({
                    message: 'startDate must be in the future',
                    status: 'failed'
                });
            }

            schedule.nextRunAt = parsedStartDate;
        }

        schedule.fromaccount = fromUserAccount._id;
        schedule.toaccount = toUserAccount._id;

        await schedule.save();

        return res.status(200).json({
            message: 'Scheduled transaction updated successfully',
            status: 'success',
            scheduledTransaction: schedule
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to update scheduled transaction',
            status: 'failed'
        });
    }
}

async function cancelScheduledTransaction(req, res) {
    try {
        const { id } = req.params;

        const schedule = await scheduledTransactionModel.findById(id);

        if (!schedule) {
            return res.status(404).json({
                message: 'Scheduled transaction not found',
                status: 'failed'
            });
        }

        if (schedule.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: 'You can only cancel your own scheduled transactions',
                status: 'failed'
            });
        }

        if (schedule.status !== 'PENDING') {
            return res.status(400).json({
                message: 'Only PENDING schedules can be cancelled',
                status: 'failed'
            });
        }

        if (new Date(schedule.nextRunAt).getTime() <= Date.now()) {
            return res.status(400).json({
                message: 'Only future schedules can be cancelled',
                status: 'failed'
            });
        }

        schedule.status = 'CANCELLED';
        await schedule.save();

        return res.status(200).json({
            message: 'Scheduled transaction cancelled successfully',
            status: 'success',
            scheduledTransaction: schedule
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to cancel scheduled transaction',
            status: 'failed'
        });
    }
}

module.exports = {
    createScheduledTransaction,
    getMyScheduledTransactions,
    updateScheduledTransaction,
    cancelScheduledTransaction
};
