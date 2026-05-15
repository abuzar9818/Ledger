const { Router } = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const auditLogController = require('../controller/auditLogController');
const adminController = require('../controller/adminController');

const adminRoutes = Router();

adminRoutes.get(
    '/audit-logs',
    authMiddleware.authMiddleware,
    authMiddleware.adminMiddleware,
    auditLogController.getAuditLogs
);

adminRoutes.get(
    '/pending-accounts',
    authMiddleware.authMiddleware,
    authMiddleware.adminMiddleware,
    adminController.getPendingAccounts
);

adminRoutes.patch(
    '/accounts/:id/status',
    authMiddleware.authMiddleware,
    authMiddleware.adminMiddleware,
    adminController.updateAccountStatus
);

module.exports = adminRoutes;
