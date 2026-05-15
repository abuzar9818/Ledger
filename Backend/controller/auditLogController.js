const auditLogModel = require('../models/auditLogModel');

async function getAuditLogs(req, res) {
    try {
        const {
            page = 1,
            limit = 20,
            actionType,
            startDate,
            endDate,
            userId
        } = req.query;

        const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
        const limitNumber = Math.max(parseInt(limit, 10) || 20, 1);
        const skip = (pageNumber - 1) * limitNumber;

        const validActionTypes = ['LOGIN', 'TRANSFER', 'FREEZE', 'UNFREEZE', 'REVERSAL'];
        const queryFilter = {};

        if (actionType) {
            const normalizedActionType = String(actionType).toUpperCase();
            if (!validActionTypes.includes(normalizedActionType)) {
                return res.status(400).json({
                    message: 'Invalid actionType filter',
                    status: 'failed'
                });
            }
            queryFilter.actionType = normalizedActionType;
        }

        if (userId) {
            queryFilter.userId = userId;
        }

        const timestampFilter = {};

        if (startDate) {
            const parsedStartDate = new Date(startDate);
            if (Number.isNaN(parsedStartDate.getTime())) {
                return res.status(400).json({
                    message: 'Invalid startDate filter',
                    status: 'failed'
                });
            }
            timestampFilter.$gte = parsedStartDate;
        }

        if (endDate) {
            const parsedEndDate = new Date(endDate);
            if (Number.isNaN(parsedEndDate.getTime())) {
                return res.status(400).json({
                    message: 'Invalid endDate filter',
                    status: 'failed'
                });
            }
            timestampFilter.$lte = parsedEndDate;
        }

        if (timestampFilter.$gte && timestampFilter.$lte && timestampFilter.$gte > timestampFilter.$lte) {
            return res.status(400).json({
                message: 'startDate cannot be greater than endDate',
                status: 'failed'
            });
        }

        if (Object.keys(timestampFilter).length > 0) {
            queryFilter.timestamp = timestampFilter;
        }

        const logs = await auditLogModel
            .find(queryFilter)
            .populate('userId', 'name email role')
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limitNumber)
            .lean();

        const totalRecords = await auditLogModel.countDocuments(queryFilter);
        const totalPages = totalRecords === 0 ? 0 : Math.ceil(totalRecords / limitNumber);

        return res.status(200).json({
            message: 'Audit logs fetched successfully',
            totalRecords,
            totalPages,
            currentPage: pageNumber,
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
