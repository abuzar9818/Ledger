const mongoose = require('mongoose');

const scheduledTransactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User id is required'],
        index: true
    },
    fromaccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: [true, 'From account is required'],
        index: true
    },
    toaccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: [true, 'To account is required'],
        index: true
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: [0.01, 'Amount must be greater than zero']
    },
    recurrence: {
        type: String,
        enum: {
            values: ['DAILY', 'WEEKLY', 'MONTHLY'],
            message: 'Invalid recurrence type'
        },
        required: [true, 'Recurrence is required']
    },
    status: {
        type: String,
        enum: {
            values: ['PENDING', 'PAUSED', 'CANCELLED'],
            message: 'Invalid schedule status'
        },
        default: 'PENDING',
        index: true
    },
    nextRunAt: {
        type: Date,
        required: [true, 'nextRunAt is required'],
        index: true
    },
    lastRunAt: {
        type: Date,
        default: null
    },
    lastError: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

scheduledTransactionSchema.index({ status: 1, nextRunAt: 1 });

const scheduledTransactionModel = mongoose.model('ScheduledTransaction', scheduledTransactionSchema);

module.exports = scheduledTransactionModel;
