function isAdmin(req,res,next){
    if(!req.user){
        return res.status(401).json({message:"Unauthorized",status:"failed"});
    }

    if(req.user.role !== 'ADMIN'){
        return res.status(403).json({message:"Forbidden: Requires admin privileges",status:"failed"});
    }

    return next();
}

function isSystem(req,res,next){
    if(!req.user){
        return res.status(401).json({message:"Unauthorized",status:"failed"});
    }

    if(req.user.role !== 'SYSTEM'){
        return res.status(403).json({message:"Forbidden: Requires system privileges",status:"failed"});
    }

    return next();
}

module.exports={isAdmin,isSystem};
