const express = require('express')
const authMiddleware = require('./../Controller/authController')
const User = require('./../Model/userModel')
const Account = require('./../Model/bankModel')

const Router = express.Router()

Router.get('/balance',authMiddleware,async (req,res)=>{
    try {
        const account = await Account.find({
            userId:req.userId
        })
        
        res.status(200).json({
            status:"success",
            data:{
                account
            }
            
        })
    } catch (error) {
        console.log(error);
    }

})
module.exports=Router
