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
        return res.status(401).json({message:"You need to login",status:"failed"});
    }

    const isBlacklisted=await blacklistModel.findOne({token});

    if(isBlacklisted){
        return res.status(401).json({message:"You need to login",status:"failed"});
    }

    try {
        const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY);
        const user=await userModel.findById(decoded.userId).select('+systemUser');
        if(!user){
            return res.status(401).json({message:"You need to login",status:"failed"});
        }
        if(user.systemUser===true){
            return res.status(403).json({message:"SYSTEM user cannot login",status:"failed"});
        }
        req.user=user;
        next();
    } catch (error) {
        console.error("Authentication error:",error);
        res.status(401).json({message:"You need to login",status:"failed"});
    }
}

function adminMiddleware(req,res,next){
    if(!req.user){
        return res.status(401).json({message:"Unauthorized",status:"failed"});
    }

    if(req.user.role !== 'ADMIN'){
        return res.status(403).json({message:"Forbidden: Requires admin privileges",status:"failed"});
    }

    return next();
}

async function blockSystemUserLoginMiddleware(req,res,next){
    try {
        const {email}=req.body;

        if(!email){
            return next();
        }

        const user=await userModel.findOne({email}).select('+systemUser');

        if(user?.systemUser===true){
            return res.status(403).json({message:"SYSTEM user cannot login",status:"failed"});
        }

        return next();
    } catch (error) {
        console.error("SYSTEM login guard error:",error);
        return res.status(500).json({message:"Unable to process login",status:"failed"});
    }
}

// Middleware to check if user has SYSTEM role
async function systemUserMiddleware(req,res,next){
    if(!req.user){
        return authMiddleware(req,res,()=>{
            if(req.user.role !== 'SYSTEM'){
                return res.status(403).json({message:"Forbidden: Requires SYSTEM role",status:"failed"});
            }
            return next();
        });
    }

    if(req.user.role !== 'SYSTEM'){
        return res.status(403).json({message:"Forbidden: Requires SYSTEM role",status:"failed"});
    }

    return next();
}

module.exports={authMiddleware, adminMiddleware, systemUserMiddleware, blockSystemUserLoginMiddleware};