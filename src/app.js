const express=require('express');
const cookieParser=require('cookie-parser');

// Import routes
const authRoutes=require('./routes/authRoutes');
const accountRoutes=require('./routes/accountRoutes');
const transactionRoutes=require('./routes/transactionRoutes');

const app=express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// Use routes
app.use('/api/auth',authRoutes);
app.use('/api/accounts',accountRoutes);
app.use('/api/transactions',transactionRoutes);


module.exports=app;