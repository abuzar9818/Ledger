const express=require('express');
const morgan=require('morgan');
const cookieParser=require('cookie-parser');
const cors=require('cors');
const swaggerUi=require('swagger-ui-express');

// Import routes
const authRoutes=require('./routes/authRoutes');
const accountRoutes=require('./routes/accountRoutes');
const transactionRoutes=require('./routes/transactionRoutes');
const scheduledTransactionRoutes=require('./routes/scheduledTransactionRoutes');
const reportsRoutes=require('./routes/reportsRoutes');
const freezeUnfreezeRoutes=require('./routes/Freeze_UnfreezeRoutes');
const adminRoutes=require('./routes/adminRoutes');
const accountClosureRequestRoutes=require('./routes/accountClosureRequestRoutes');
const accountReopenRequestRoutes=require('./routes/accountReopenRequestRoutes');
const swaggerDocument=require('./config/swagger');

const app=express();

const allowedOrigin=process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({
    origin: allowedOrigin,
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
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
app.use('/reports',reportsRoutes);
app.use('/api',freezeUnfreezeRoutes);
app.use('/admin',adminRoutes);
app.use('/api/account-closure-requests',accountClosureRequestRoutes);
app.use('/api/account-reopen-requests',accountReopenRequestRoutes);


module.exports=app;