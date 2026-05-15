const userModel=require('../models/userModel');
const jwt=require('jsonwebtoken');
const emailService=require('../services/emailService');
const tokenBlacklistModel=require('../models/blacklistModel');
const auditLogService=require('../services/auditLogService');

//user registration controller
// Post api/auth/register
async function userRegisterController(req,res){
    const {name,email,password}=req.body;

    const isExist= await userModel.findOne({email});
    if(isExist){
        return res.status(422).json({message:"Email already exists",status:"failed"});
    }

    const user=await userModel.create({name,email,password});
    const token=jwt.sign({userId:user._id},process.env.JWT_SECRET_KEY,{expiresIn:'3d'});

    res.cookie('token',token)
    res.status(201).json({
        user:{
            _id:user._id,
            name:user.name,
            email:user.email,
            role:user.role
        },
        message:"User registered successfully",
        status:"success",
        token
    });

    // Send registration email
    await emailService.sendRegistrationEmail(user.email,user.name);
}

//user login controller
// Post api/auth/login
async function userLoginController(req,res){
    const {email,password}=req.body;

    const user=await userModel.findOne({email}).select('+password +systemUser');
    if(!user){
        return res.status(404).json({message:"User not found",status:"failed"});
    }

    if(user.systemUser===true){
        return res.status(403).json({message:"SYSTEM user cannot login",status:"failed"});
    }

    const isMatch=await user.comparePassword(password);
    if(!isMatch){
        return res.status(401).json({message:"Invalid credentials",status:"failed"});
    }

    const token=jwt.sign({userId:user._id},process.env.JWT_SECRET_KEY,{expiresIn:'3d'});

    // Extract device info from User-Agent
    const userAgent = req.headers['user-agent'] || 'Unknown Device';
    
    // Add to active sessions
    user.activeSessions.push({
        device: userAgent,
        ip: req.ip,
        token: token,
        loginTime: new Date()
    });
    
    // Limit active sessions to the most recent 5
    if (user.activeSessions.length > 5) {
        user.activeSessions = user.activeSessions.slice(-5);
    }
    
    await user.save();

    await auditLogService.logAuditEvent({
        userId: user._id,
        actionType: 'LOGIN',
        metadata: {
            email: user.email,
            ip: req.ip,
            device: userAgent
        }
    });

    res.cookie('token',token)
    res.status(200).json({
        user:{
            _id:user._id,
            name:user.name,
            email:user.email,
            role:user.role,
            theme:user.theme
        },
        message:"User logged in successfully",
        status:"success",
        token});
}

//user logout controller
// Post api/auth/logout
async function userLogoutController(req,res){
    const token=req.cookies.token || req.headers.authorization?.split(' ')[1];
    
    if(!token){
        return res.status(200).json({message:"User Logged out Successfully"});
    }
    await tokenBlacklistModel.create({
        token:token,
    });

        res.clearCookie('token');

    res.status(200).json({message:"User Logged out Successfully"});
}

module.exports={userRegisterController,userLoginController,userLogoutController};