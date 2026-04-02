const { Router } = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const auditLogController = require('../controller/auditLogController');

const adminRoutes = Router();

adminRoutes.get(
    '/audit-logs',
    authMiddleware.authMiddleware,
    authMiddleware.adminMiddleware,
    auditLogController.getAuditLogs
);

module.exports = adminRoutes;
