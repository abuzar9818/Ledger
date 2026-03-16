const userModel=require('../models/userModel');
const jwt=require('jsonwebtoken');
const blacklistModel=require('../models/blacklistModel');  

function normalizeToken(token){
    if(!token || typeof token !== 'string'){
        return null;
    }

    let parsedToken=token.trim();

    // Handle values like: token=<jwt>; Path=/
    if(parsedToken.startsWith('token=')){
        parsedToken=parsedToken.slice(6);
    }

    if(parsedToken.includes(';')){
        parsedToken=parsedToken.split(';')[0].trim();
    }

    return parsedToken || null;
}

function getTokenFromRequest(req){
    const authHeader=req.headers.authorization || req.header('authorization');
    const bearerToken=authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    const cookieToken=req.cookies?.token;
    const rawCookieHeader=req.headers.cookie || req.header('cookie');

    return normalizeToken(bearerToken) || normalizeToken(cookieToken) || normalizeToken(rawCookieHeader);
}


// Authentication middleware
async function authMiddleware(req,res,next){
    const token=getTokenFromRequest(req);
    if(!token){
        return res.status(401).json({message:"Unauthorized",status:"failed"});
    }

    const isBlacklisted=await blacklistModel.findOne({token});

    if(isBlacklisted){
        return res.status(401).json({message:"Unauthorized Access",status:"failed"});
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
    const token=getTokenFromRequest(req);
    if(!token){
        return res.status(401).json({message:"Unauthorized",status:"failed"});
    }

    const isBlacklisted=await blacklistModel.findOne({token});

    if(isBlacklisted){
        return res.status(401).json({message:"Unauthorized Access",status:"failed"});
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