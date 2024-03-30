const express = require('express');
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Router = require('./Routes/routes')
const cors = require('cors')


dotenv.config()
const app = express();
app.use(cors());
app.use(express.json())

app.use('/api/v1/',Router);    
//////////// SERVER ////////////////////////

mongoose.connect(process.env.DB).then(()=>{
    console.log("Database connected");
}).catch(err=>{
    console.log(err);
})

app.listen('3000',()=>{
    console.log("Server running on port 3000");
})
module.exports=app