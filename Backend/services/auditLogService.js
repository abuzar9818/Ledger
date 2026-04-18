const auditLogModel = require('../models/auditLogModel');

async function logAuditEvent({ userId, actionType, metadata = {} }) {
    if (!userId || !actionType) {
        return;
    }

    try {
        await auditLogModel.create({
            userId,
            actionType,
            metadata,
            timestamp: new Date()
        });
    } catch (error) {
        console.error('Audit log write failed:', error.message);
    }
}

module.exports = {
    logAuditEvent
};
