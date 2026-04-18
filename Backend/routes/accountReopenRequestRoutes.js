const { Router } = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const accountReopenRequestController = require('../controller/accountReopenRequestController');

const accountReopenRequestRoutes = Router();

accountReopenRequestRoutes.post(
    '/accounts/:id/reopen-request',
    authMiddleware.authMiddleware,
    accountReopenRequestController.requestAccountReopen
);

accountReopenRequestRoutes.get(
    '/accounts/my-reopen-requests',
    authMiddleware.authMiddleware,
    accountReopenRequestController.getMyReopenRequests
);

accountReopenRequestRoutes.get(
    '/admin/reopen-requests',
    authMiddleware.authMiddleware,
    authMiddleware.adminMiddleware,
    accountReopenRequestController.getAllReopenRequests
);

accountReopenRequestRoutes.patch(
    '/admin/reopen-request/:id/approve',
    authMiddleware.authMiddleware,
    authMiddleware.adminMiddleware,
    accountReopenRequestController.approveReopenRequest
);

accountReopenRequestRoutes.patch(
    '/admin/reopen-request/:id/reject',
    authMiddleware.authMiddleware,
    authMiddleware.adminMiddleware,
    accountReopenRequestController.rejectReopenRequest
);

module.exports = accountReopenRequestRoutes;
