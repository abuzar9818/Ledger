const mongoose=require('mongoose');

const ledgerEntrySchema=new mongoose.Schema({
    account:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Account',
        required:[true,"Ledger entry must be associated with an account"],
        index:true,
        imutable:true
    },
    amount:{
        type:Number,
        required:[true,"Amount is required"],
        imutable:true
    },
    transaction:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Transaction',
        required:[true,"Ledger entry must be associated with a transaction"],
        index:true,
        imutable:true
    },
    type:{
        type:String,
        enums:{
            values:["DEBIT","CREDIT"],
            message:"Invalid ledger entry type"
        },
        required:[true,"Ledger entry type is required"],
        imutable:true
    }
},{
    timestamps:true
})

function preventLedgerModification(next){
    throw new Error("Ledger entries cannot be modified after creation");
}

ledgerEntrySchema.pre('findOneAndUpdate',preventLedgerModification);
ledgerEntrySchema.pre('updateOne',preventLedgerModification);
ledgerEntrySchema.pre('updateMany',preventLedgerModification);
ledgerEntrySchema.pre('deleteOne',preventLedgerModification);
ledgerEntrySchema.pre('deleteMany',preventLedgerModification);
ledgerEntrySchema.pre('remove',preventLedgerModification);
ledgerEntrySchema.pre('findOneAndDelete',preventLedgerModification);
ledgerEntrySchema.pre('findOneAndReplace',preventLedgerModification);

const ledgerModel=mongoose.model('Ledger',ledgerEntrySchema);

module.exports=ledgerModel;