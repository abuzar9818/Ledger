const userModel=require('../models/userModel');

async function userRegisterController(req,res){
    const {name,email,password}=req.body;

    const isExist= await userModel.findOne({email});
    if(isExist){
        return res.status(400).json({message:"Email already exists"});
    }
}

module.exports={userRegisterController};