const express = require('express')
const authMiddleware = require('./../Controller/authController')
const User = require('./../Model/userModel')
const Account = require('./../Model/bankModel')
const mongoose = require('mongoose')

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

Router.post("/transfer", authMiddleware, async (req, res) => {
    const { amount, to } = req.body;

    const sender = await Account.findOne({
        userId: req.userId
    });

    if (sender.balance < amount) {
        return res.status(400).json({
            message: "Insufficient balance"
        })
    }

    const receiver = await Account.findOne({
        userId: to
    });

    if (!receiver) {
        return res.status(400).json({
            message: "Invalid account"
        })
    }

    await Account.updateOne({
        userId: req.userId
    }, {
        $inc: {
            balance: -amount
        }
    })

    await Account.updateOne({
        userId: to
    }, {
        $inc: {
            balance: amount
        }
    })

    res.json({
        message: "Transfer successful"
    })
});

/*
            EFFICIENT BUT GIVING SOME ERRORS WILL FIX LATER
    MongoServerError: Transaction numbers are only allowed on a replica set member or mongos
Router.post('/transfer',authMiddleware, async (req,res)=>{
    const session = await mongoose.startSession()
    session.startTransaction();
    const {to,amount}= req.body;
    const sender = await Account.findOne({_id:req.body.userId}).session(session)
    if(!sender || sender.balance < amount){
        await session.abortTransaction();
        res.status(400).json({
            message:"Insufficient Balance"
        })
    }
    const receiver = await User.findOne({
        _id:to
    })
    if(!receiver){
        await session.abortTransaction()
        res.status(400).json({
            message:"Invalid account"
        })
    }
    await Account.updateOne({userId:req.body.userId},{$inc:{balance:-amount}}).session(session)
    await Account.updateOne({userId: to},{$inc:{balance:amount}}).session(session);
    await session.commitTransaction();
    res.json({
        message: "Transfer successful"
    });
})
*/

module.exports=Router
