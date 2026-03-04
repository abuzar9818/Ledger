const userModel=require('../models/userModel');
const jwt=require('jsonwebtoken');

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
            email:user.email
        },
        message:"User registered successfully",
        status:"success",
        token});
}

module.exports={userRegisterController};