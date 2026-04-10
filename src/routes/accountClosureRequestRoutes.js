const { Router } = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const accountClosureRequestController = require('../controller/accountClosureRequestController');

const accountClosureRequestRoutes = Router();

accountClosureRequestRoutes.post(
    '/accounts/:id/close-request',
    authMiddleware.authMiddleware,
    accountClosureRequestController.requestAccountClosure
);

accountClosureRequestRoutes.get(
    '/accounts/my-close-requests',
    authMiddleware.authMiddleware,
    accountClosureRequestController.getMyClosureRequests
);

accountClosureRequestRoutes.get(
    '/admin/close-requests',
    authMiddleware.authMiddleware,
    authMiddleware.adminMiddleware,
    accountClosureRequestController.getAllClosureRequests
);

accountClosureRequestRoutes.patch(
    '/admin/close-request/:id/approve',
    authMiddleware.authMiddleware,
    authMiddleware.adminMiddleware,
    accountClosureRequestController.approveClosureRequest
);

accountClosureRequestRoutes.patch(
    '/admin/close-request/:id/reject',
    authMiddleware.authMiddleware,
    authMiddleware.adminMiddleware,
    accountClosureRequestController.rejectClosureRequest
);

module.exports = accountClosureRequestRoutes;
