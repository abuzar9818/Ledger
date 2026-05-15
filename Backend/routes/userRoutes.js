const { Router } = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const userController = require('../controller/userController');

const userRoutes = Router();

userRoutes.use(authMiddleware.authMiddleware);

// PUT /api/users/profile
userRoutes.put('/profile', userController.updateProfile);

// GET /api/users/sessions
userRoutes.get('/sessions', userController.getSessions);

// DELETE /api/users/sessions/:sessionId
userRoutes.delete('/sessions/:sessionId', userController.revokeSession);

module.exports = userRoutes;
