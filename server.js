require('dotenv').config();
const app=require('./Backend/app');
const connectDB=require('./Backend/config/db');
const scheduledTransactionService=require('./Backend/services/scheduledTransactionService');

connectDB();
scheduledTransactionService.startScheduledTransactionCron();

app.listen(3000,()=>{
    console.log('Server is running on port 3000');
});