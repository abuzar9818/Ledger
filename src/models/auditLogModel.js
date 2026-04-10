const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User id is required'],
        index: true
    },
    actionType: {
        type: String,
        enum: {
            values: ['LOGIN', 'TRANSFER', 'FREEZE', 'UNFREEZE', 'REVERSAL', 'REOPEN'],
            message: 'Invalid action type'
        },
        required: [true, 'Action type is required'],
        index: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
});

const auditLogModel = mongoose.model('AuditLog', auditLogSchema);

module.exports = auditLogModel;
