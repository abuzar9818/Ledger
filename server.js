require('dotenv').config();
const app=require('./src/app');
const connectDB=require('./src/config/db');
const scheduledTransactionService=require('./src/services/scheduledTransactionService');

connectDB();
scheduledTransactionService.startScheduledTransactionCron();

app.listen(3000,()=>{
    console.log('Server is running on port 3000');
});