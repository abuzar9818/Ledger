const mongoose = require('mongoose');
const ledgerModel = require('./ledgerModel');

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

accountSchema.methods.getBalance=async function(){

    const balanceResult=await ledgerModel.aggregate([
        {$match:{accountId:this._id}},
        {$group:{
            _id:null,
            totalDebits:{
                $sum:{
                    $cond:[{$eq:["$type","DEBIT"]},"$amount",0]
                    }
                },
            totalCredits:{
                $sum:{
                    $cond:[{$eq:["$type","CREDIT"]},"$amount",0]
                    }
                }
            }
        },
        {
            $project:{
                _id:0,
                balance:{$subtract:["$totalCredits","$totalDebbits"]}
            }
        }
    ])
    if(balanceResult.length === 0){
        return 0;
    }
    return balanceResult[0].balance;    
}

const accountModel=mongoose.model('Account',accountSchema);

module.exports=accountModel;