const cron = require('node-cron');
const mongoose = require('mongoose');
const scheduledTransactionModel = require('../models/scheduledTransactionModel');
const accountModel = require('../models/accountModel');
const transactionModel = require('../models/transactionModel');
const ledgerModel = require('../models/ledgerModel');
const userModel = require('../models/userModel');
const auditLogService = require('./auditLogService');

let isRunning = false;

function getNextRunAt(currentDate, recurrence) {
    const nextDate = new Date(currentDate);

    if (recurrence === 'DAILY') {
        nextDate.setDate(nextDate.getDate() + 1);
        return nextDate;
    }

    if (recurrence === 'WEEKLY') {
        nextDate.setDate(nextDate.getDate() + 7);
        return nextDate;
    }

    nextDate.setMonth(nextDate.getMonth() + 1);
    return nextDate;
}

async function executeScheduledTransfer(schedule, systemUserId) {
    let session;

    const fromAccount = await accountModel.findById(schedule.fromaccount);
    const toAccount = await accountModel.findById(schedule.toaccount);

    if (!fromAccount || !toAccount) {
        throw new Error('Invalid from or to account for schedule');
    }

    if (fromAccount.status !== 'ACTIVE' || toAccount.status !== 'ACTIVE') {
        throw new Error('Both accounts must be ACTIVE for scheduled transfer');
    }

    const balance = await fromAccount.getBalance();

    if (balance < schedule.amount) {
        throw new Error('Insufficient balance for scheduled transfer');
    }

    session = await mongoose.startSession();
    session.startTransaction();

    try {
        const transferTx = (await transactionModel.create([{
            fromaccount: schedule.fromaccount,
            toaccount: schedule.toaccount,
            amount: schedule.amount,
            idempotencykey: `scheduled-${schedule._id}-${Date.now()}`,
            status: 'PENDING'
        }], { session }))[0];

        await ledgerModel.create([
            {
                account: schedule.fromaccount,
                amount: schedule.amount,
                transaction: transferTx._id,
                type: 'DEBIT'
            },
            {
                account: schedule.toaccount,
                amount: schedule.amount,
                transaction: transferTx._id,
                type: 'CREDIT'
            }
        ], { session, ordered: true });

        await transactionModel.findByIdAndUpdate(
            transferTx._id,
            { status: 'COMPLETED' },
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        await auditLogService.logAuditEvent({
            userId: systemUserId,
            actionType: 'TRANSFER',
            metadata: {
                scheduled: true,
                scheduledTransactionId: schedule._id,
                transactionId: transferTx._id,
                fromAccount: schedule.fromaccount,
                toAccount: schedule.toaccount,
                amount: schedule.amount,
                initiatedByUserId: schedule.userId
            }
        });
    } catch (error) {
        if (session) {
            await session.abortTransaction();
            session.endSession();
        }
        throw error;
    }
}

async function processDueScheduledTransactions() {
    if (isRunning) {
        return;
    }

    isRunning = true;

    try {
        const systemUser = await userModel
            .findOne({ systemUser: true })
            .select('_id name email +systemUser')
            .lean();

        if (!systemUser?._id) {
            console.error('Scheduled transaction runner skipped: SYSTEM user not found');
            return;
        }

        console.info(`Scheduled transaction runner using SYSTEM user: ${systemUser._id}`);

        const now = new Date();
        const dueSchedules = await scheduledTransactionModel.find({
            status: 'PENDING',
            nextRunAt: { $lte: now }
        });

        console.info(`Scheduled transaction runner found ${dueSchedules.length} due transaction(s)`);

        for (const schedule of dueSchedules) {
            const nextRunAt = getNextRunAt(schedule.nextRunAt || now, schedule.recurrence);

            try {
                await executeScheduledTransfer(schedule, systemUser._id);

                schedule.lastRunAt = now;
                schedule.lastError = null;
                schedule.nextRunAt = nextRunAt;
                await schedule.save();
            } catch (error) {
                schedule.lastError = error.message;
                schedule.nextRunAt = nextRunAt;
                await schedule.save();
                console.error(`Scheduled transfer failed for ${schedule._id}:`, error.message);
            }
        }
    } catch (error) {
        console.error('Scheduled transaction processor error:', error);
    } finally {
        isRunning = false;
    }
}

function startScheduledTransactionCron() {
    cron.schedule('* * * * *', async () => {
        await processDueScheduledTransactions();
    });
}

module.exports = {
    getNextRunAt,
    processDueScheduledTransactions,
    startScheduledTransactionCron
};
