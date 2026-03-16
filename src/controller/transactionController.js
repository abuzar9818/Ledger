const transactionModel=require('../models/transactionModel');
const ledgerModel=require('../models/ledgerModel');
const accountModel=require('../models/accountModel');
const emailService=require('../services/emailService');
const mongoose=require('mongoose');


async function createTransactionController(req, res) {


    try {
    // Validate request
    const { fromAccount, toAccount, amount, idempotencyKey  } = req.body;

    if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const fromUserAccount = await accountModel.findOne({
        _id: fromAccount,
    });
    const toUserAccount = await accountModel.findOne({
        _id: toAccount,
    });

    if (!fromUserAccount || !toUserAccount) {
        return res.status(404).json({ error: "Invalid From or To Account" });
    }

    // Validate idempotency key
    const existingTransaction = await transactionModel.findOne({ idempotencyKey });
    if(existingTransaction){
        if(existingTransaction.status==="COMPLETED"){
            return res.status(200).json({
                message:"Transaction with this idempotency key has already been completed", 
                transaction: existingTransaction });
        }
        if(existingTransaction.status==="PENDING"){
            return res.status(200).json({
                message:"Transaction with this idempotency key is still processing", 
                transaction: existingTransaction });
        }
        if(existingTransaction.status==="FAILED"){
            return res.status(500).json({
                message:"Previous transaction failed, please try again.", 
            });
        }
        if(existingTransaction.status==="REVERSED"){
            return res.status(500).json({
                message:"Previous transaction was reversed, please try again.", 
            });
        }
    }

    // Check account status
    if (fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE") {
        return res.status(400).json({ error: "Both accounts must be active to perform a transaction" });
    }

    // Derive Sender Balance from Ledger
    const balance=await fromUserAccount.getBalance();

    if(balance<amount){
        return res.status(400).json({ error: `Insufficient balance in the sender's account.Current balance is ${balance} and the requested amount is ${amount}` });
    }

    // Create transaction

    const session=await mongoose.startSession();
    session.startTransaction();

    const transaction=await transactionModel.create([{
        fromAccount,
        toAccount,
        amount,
        idempotencyKey,
        status:"PENDING"
    }],{session});
    
    const debitledgerEntry=await ledgerModel.create({
        account:fromAccount,
        amount,
        transaction:transaction._id,
        type:"DEBIT"
    },{session});

    const creditedLedgerEntry=await ledgerModel.create({
        account:toAccount,
        amount,
        transaction:transaction._id,
        type:"CREDIT"
    },{session});

    transaction.status="COMPLETED";
    await transaction.save({session});

    await session.commitTransaction();
    session.endSession();

    // Send email notifications (async, no need to await)
       try {

            emailService.sendTransactionEmail(
                fromUserAccount.email,
                "Transaction Successful",
                `Your transaction of ₹${amount} was successful.`,
                `<p>Your transaction of <strong>₹${amount}</strong> was successful.</p>`
            );

            emailService.sendTransactionEmail(
                toUserAccount.email,
                "Incoming Transaction",
                `You received ₹${amount}.`,
                `<p>You received <strong>₹${amount}</strong>.</p>`
            );

        } catch (emailError) {
            console.error("Email sending failed:", emailError);
        }

        return res.status(201).json({
            message: "Transaction completed successfully",
            transaction: transactionDoc
        });

    } catch(error) {

        await session.abortTransaction();
        session.endSession();

        console.error(error);

        return res.status(500).json({
            error: "Transaction failed"
        });
    }
}   

async function createInitialFundController(req,res){
    const { toAccount, amount, idempotencyKey } = req.body;

    if (!toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const toUserAccount = await accountModel.findOne({
        _id: toAccount,
    });
    
    if (!toUserAccount) {
        return res.status(400).json({ error: "Invalid To Account" });
    }

    const fromUserAccount = await accountModel.findOne({
        systemAccount: true,
        user:req.user._id
    });

    if (!fromUserAccount) {
        return res.status(400).json({ error: "System account not found for the user" });
    }

   const session= await mongoose.startSession();
   session.startTransaction();

   const transaction=await transactionModel.create([{
    fromAccount:fromUserAccount._id,
    toAccount,
    amount,
    idempotencyKey,
    status:"PENDING"
   }],{session});

    const debitledgerEntry=await ledgerModel.create({
        account:fromUserAccount._id,
        amount,
        transaction:transaction._id,
        type:"DEBIT"
    },{session});

    const creditedLedgerEntry=await ledgerModel.create({
        account:toAccount,
        amount,
        transaction:transaction._id,
        type:"CREDIT"
    },{session});

    transaction.status="COMPLETED";
    await transaction.save({session});
    
    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
        message: "Initial fund added successfully",
        transaction
    }); 
}

module.exports={createTransactionController, createInitialFundController};