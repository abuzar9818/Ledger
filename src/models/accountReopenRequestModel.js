const mongoose = require('mongoose');

const accountReopenRequestSchema = new mongoose.Schema({
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: [true, 'Account id is required'],
        index: true
    },
    requestedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Requested by is required'],
        index: true
    },
    status: {
        type: String,
        enum: {
            values: ['pending', 'approved', 'rejected'],
            message: 'Invalid reopen request status'
        },
        default: 'pending',
        index: true
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    reviewedAt: {
        type: Date,
        default: null
    },
    reason: {
        type: String,
        trim: true,
        default: null
    }
}, {
    timestamps: true
});

accountReopenRequestSchema.index({ accountId: 1, requestedBy: 1, status: 1 });

const accountReopenRequestModel = mongoose.model('AccountReopenRequest', accountReopenRequestSchema);

module.exports = accountReopenRequestModel;
