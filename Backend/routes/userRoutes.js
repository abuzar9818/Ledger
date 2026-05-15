const { Router } = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const userController = require('../controller/userController');

const userRoutes = Router();

// PUT /api/users/profile
userRoutes.put('/profile', authMiddleware.authMiddleware, userController.updateProfile);

// GET /api/users/sessions
userRoutes.get(
    '/sessions',
    authMiddleware.authMiddleware,
    userController.getSessions
);

userRoutes.delete(
    '/sessions/:id',
    authMiddleware.authMiddleware,
    userController.revokeSession
);

userRoutes.get(
    '/notifications',
    authMiddleware.authMiddleware,
    userController.getNotifications
);

module.exports = userRoutes;
