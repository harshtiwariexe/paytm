const express = require('express')
const authMiddleware = require('./../Controller/authController')
const User = require('./../Model/userModel')
const Account = require('./../Model/bankModel')

const Router = express.Router()

Router.get('/balance',authMiddleware,async (req,res)=>{
    try {
        const account = await Account.findOne({
            userId:req.userId
        })
        
        res.status(200).json({
            status:"success",
            data:{
                balance:account.balance
            }
            
        })
    } catch (error) {
        console.log(error);
    }

})

Router.post('/transfer',authMiddleware,async (req,res)=>{
    try {
        const {to,amount}=req.body;

        const receiver = await User.findOne({
            userId:to
        })
        if(!receiver){
            res.status(400).json({
                message:"Invalid Account"
            })
        }

        const senderBalance = await Account.findOne({
            userId:req.body.userId
        })
        if(senderBalance < amount){
            res.status(400).json({
                message:"Insufficient Balance"
            })
        }
        
        await Account.updateOne({
            userId:req.body.userId,
        },{
            $inc:{
                balance:-amount
            }
        })
        await Account.updateOne({
            userId:to,
        },{
            $inc:{
                balance:amount
            }
        })
        res.status(200).json({
            message: "Transfer Succesfull"
        })

    } catch (error) {
        console.log(error);
    }
})


module.exports=Router
