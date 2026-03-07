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

module.exports=authMiddleware;