const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const userRoute = require('./router/userRoute');
const recipientRoute = require('./router/recipientRoute');
const campaignRoute = require('./router/campaignRoute');
const google = require('./router/google');

const connectDB = require('./config/databaseconfig');
const cors = require('cors');


const app = express();
connectDB();

app.use(cors());
app.use(express.json());

console.log('userRoute:', userRoute);
console.log('userRoute type:', typeof userRoute);
app.use('/userRoute', userRoute);
app.use('/recipientRoute', recipientRoute);
app.use('/campaignRoute', campaignRoute);
app.use('/auth/google', google);


app.listen(process.env.PORT, () =>{
    console.log(`Server is running on port ${process.env.PORT}`);
});
