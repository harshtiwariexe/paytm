const express = require('express')
const User = require('./../Model/userModel')

const Router = express.Router();

Router.get('/',(req,res)=>{
    res.send("Hello from user side")
})
Router.get('/hello',(req,res)=>{
    res.send("Ram ram user")
})
module.exports=Router