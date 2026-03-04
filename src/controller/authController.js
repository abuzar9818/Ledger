const userModel=require('../models/userModel');
const jwt=require('jsonwebtoken');

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
            email:user.email
        },
        message:"User registered successfully",
        status:"success",
        token});
}

//user login controller
// Post api/auth/login
async function userLoginController(req,res){
    const {email,password}=req.body;

    const user=await userModel.findOne({email}).select('+password');
    if(!user){
        return res.status(404).json({message:"User not found",status:"failed"});
    }

    const isMatch=await user.comparePassword(password);
    if(!isMatch){
        return res.status(401).json({message:"Invalid credentials",status:"failed"});
    }

    const token=jwt.sign({userId:user._id},process.env.JWT_SECRET_KEY,{expiresIn:'3d'});

    res.cookie('token',token)
    res.status(200).json({
        user:{
            _id:user._id,
            name:user.name,
            email:user.email
        },
        message:"User logged in successfully",
        status:"success",
        token});
}

module.exports={userRegisterController,userLoginController};