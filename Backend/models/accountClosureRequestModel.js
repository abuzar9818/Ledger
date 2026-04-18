const mongoose = require('mongoose');

const accountClosureRequestSchema = new mongoose.Schema({
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
            message: 'Invalid closure request status'
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

accountClosureRequestSchema.index({ accountId: 1, requestedBy: 1, status: 1 });

const accountClosureRequestModel = mongoose.model('AccountClosureRequest', accountClosureRequestSchema);

module.exports = accountClosureRequestModel;
