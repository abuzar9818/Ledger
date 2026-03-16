const userModel=require('../models/userModel');
const jwt=require('jsonwebtoken');


// Authentication middleware
async function authMiddleware(req,res,next){
    const token=req.cookies.token || req.header.authorization?.split(" ")[1];
    if(!token){
        return res.status(401).json({message:"Unauthorized",status:"failed"});
    }
    try {
        const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY);
        const user=await userModel.findById(decoded.userId);
        if(!user){
            return res.status(401).json({message:"Unauthorized",status:"failed"});
        }
        req.user=user;
        next();
    } catch (error) {
        console.error("Authentication error:",error);
        res.status(401).json({message:"Unauthorized",status:"failed"});
    }
}

// Middleware to check if user is a system user
async function systemUserMiddleware(req,res,next){
    const token=req.cookies.token || req.header.authorization?.split(" ")[1];
    if(!token){
        return res.status(401).json({message:"Unauthorized",status:"failed"});
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY);
        const user=await userModel.findById(decoded.userId).select('+systemUser');
        if(!user.systemUser){
            return res.status(403).json({message:"Forbidden: Requires system user privileges",status:"failed"});
        }
        req.user=user;
        return next();
    }catch(error){
        console.error("System user check error:",error);
        return res.status(401).json({message:"Unauthorized",status:"failed"});
    }
}

module.exports={authMiddleware, systemUserMiddleware};