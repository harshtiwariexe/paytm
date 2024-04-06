const express = require('express');
const User = require('./../Model/userModel');
const zod = require('zod');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./../Controller/authController')
const Account = require('./../Model/bankModel')


const Router = express.Router();

const signupSchema = zod.object({
    email: zod.string(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string()
});
const signinSchema = zod.object({
    email:zod.string(),
    password:zod.string()
})
const updateSchema = zod.object({
    password:zod.string(),
    firstName:zod.string(),
    lastName:zod.string()
})

Router.post("/signup", async (req, res) => {    
    const { success } = signupSchema.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const existingUser = await User.findOne({
        email: req.body.email
    })

    if (existingUser) {
        return res.status(411).json({
            message: "Email already taken/Incorrect inputs"
        })
    }

    const user = await User.create({
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    })
    const userId = user._id;

    await Account.create({
        userId,
        balance:1+Math.random()*1000
    })

    const token = jwt.sign({
        userId
    }, process.env.JWT_SECRET);

    res.json({
        message: "User created successfully",
        token: token,
        data:{
            user,Account
        }
    })
})

Router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const {success} = signinSchema.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    try {
        const user = await User.findOne({ email }).select('+password');
        const correct =await user.correctPassword(password,user.password)
        console.log(correct);

        if (!user) {
            return res.status(401).json({
                status: "Failed",
                message: "User not found"
            });
        }

        
        if (!correct) {
            return res.status(401).json({
                status: "Failed",
                message: "Invalid password"
            });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        res.status(200).json({
            status: "success",
            token
        });
    } catch (error) {
        console.error("Error in signin:", error);
        res.status(500).json({
            status: "Failed",
            message: "Internal server error"
        });
    }
});

Router.post('/update',authMiddleware,async(req,res)=>{
    const {password,firstName,lastName} = req.body
    const { success } = updateSchema.safeParse(req.body)
    if(!success){
        res.status(403).send({
            status:"Failed",
            message:"Invalid Input"
        })
    }
    await User.findOneAndUpdate({_id:req.userId},req.body)
    res.status(200).json({
        status:"Success",
        message:"Updated successfully"
    })

})

Router.get('/getUser',async (req,res)=>{
    const filters = req.query.filter || "";
    const users = await User.find({
        $or:[{
                firstName:{
                    "$regex":filters
                }
            },{
                lastName:{
                    "$regex":filters
                }
            }]
    })
    res.json({
        user:users.map(user=>({
            email:user.email,
            firstName:user.firstName,
            lastName:user.lastName,
            _id:user._id
        }))
    })
})

module.exports = Router;
