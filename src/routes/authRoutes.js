const express=require('express');
const authController=require('../controller/authController');
const rateLimitMiddleware=require('../middleware/rateLimitMiddleware');

const router=express.Router();

// Post api/auth/register
router.post('/register',rateLimitMiddleware.authLimiter,authController.userRegisterController);

// Post api/auth/login
router.post('/login',rateLimitMiddleware.authLimiter,authController.userLoginController);

// Post api/auth/logout
router.post('/logout', authController.userLogoutController);

module.exports=router;
