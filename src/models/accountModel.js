const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:[true,"Account must be associated with a user"]
    },
    status:{
        type:String,
        enums:{
            values:["ACTIVE","FROZEN","CLOSED"], 
            message:"Invalid account status",
        },
        default:"ACTIVE"
    },
    currency:{
        type:String,
        required:[true,"Currency is required"],
        default:"INR",
        trim:true,
        uppercase:true,
        match:[/^[A-Z]{3}$/,"Currency must be a valid 3-letter code"]
    }
},{
    timestamps:true
});

accountSchema.index({user:1},{status:1});

const accountModel=mongoose.model('Account',accountSchema);

module.exports=accountModel;