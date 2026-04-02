const express=require('express');
const cookieParser=require('cookie-parser');
const swaggerUi=require('swagger-ui-express');

// Import routes
const authRoutes=require('./routes/authRoutes');
const accountRoutes=require('./routes/accountRoutes');
const transactionRoutes=require('./routes/transactionRoutes');
const scheduledTransactionRoutes=require('./routes/scheduledTransactionRoutes');
const freezeUnfreezeRoutes=require('./routes/Freeze_UnfreezeRoutes');
const adminRoutes=require('./routes/adminRoutes');
const swaggerDocument=require('./config/swagger');

const app=express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// Use routes


app.get("/",(req,res)=>{
    res.send("Welcome to Ledger API");
});

app.use('/api/auth',authRoutes);
app.use('/api/accounts',accountRoutes);
app.use('/api/transactions',transactionRoutes);
app.use('/api/scheduled-transactions',scheduledTransactionRoutes);
app.use('/api',freezeUnfreezeRoutes);
app.use('/admin',adminRoutes);


module.exports=app;