const mongoose=require('mongoose');

const transactionSchema=new mongoose.Schema({
    fromaccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Account',
        required:[true,"From account is required"],
        index:true
    },
    toaccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Account',
        required:[true,"To account is required"],
        index:true
    },
    status:{
        type:String,
        enums:{
            values:["PENDING","COMPLETED","FAILED","REVERSED"],
            message:"Invalid transaction status"
        },
        default:"PENDING"
    },
    amount:{
        type:Number,
        required:[true,"Amount is required"],
        min:[0,"Amount must be at least 0"]
    },
    idempotencykey:{
        type:String,
        required:[true,"Idempotency key is required"],
        unique:true,
        trim:true,
        index:true
    },
    reversedTransaction:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Transaction',
        default:null,
        index:true
    }
},{
    timestamps:true
});

const transactionModel=mongoose.model('Transaction',transactionSchema);

module.exports=transactionModel;