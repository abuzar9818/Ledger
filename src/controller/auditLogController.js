const auditLogModel = require('../models/auditLogModel');

async function getAuditLogs(req, res) {
    try {
        const logs = await auditLogModel
            .find({})
            .sort({ timestamp: -1 })
            .lean();

        return res.status(200).json({
            message: 'Audit logs fetched successfully',
            logs
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to fetch audit logs',
            status: 'failed'
        });
    }
}

module.exports = {
    getAuditLogs
};
