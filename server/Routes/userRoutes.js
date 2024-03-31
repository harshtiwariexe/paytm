const express = require('express');
const User = require('./../Model/userModel');
const zod = require('zod');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const Router = express.Router();

const signupSchema = zod.object({
    username: zod.string(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string()
});
const signinSchema = zod.object({
    username:zod.string(),
    password:zod.string()
})

Router.post('/signup', async (req, res) => {
    const { username, password, firstName, lastName } = req.body;

    const { success } = signupSchema.safeParse(req.body);
    if (!success) {
        return res.status(401).json({
            status: "Failed",
            message: "Incorrect Credentials"
        });
    }

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(401).json({
                status: "Failed",
                message: "User already exists"
            });
        }

        const newUser = await User.create({
            username,
            password,
            firstName,
            lastName
        });

        const token = jwt.sign({
            userId: newUser._id
        }, process.env.JWT_SECRET);

        res.status(200).json({
            status: "success",
            token,
        });
    } catch (error) {
        console.error("Error in signup:", error);
        res.status(500).json({
            status: "Failed",
            message: "Internal server error"
        });
    }
});

Router.post('/signin', async (req, res) => {
    const { username, password } = req.body;
    const {success} = signinSchema.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    try {
        const user = await User.findOne({ username }).select('+password');

        if (!user) {
            return res.status(401).json({
                status: "Failed",
                message: "User not found"
            });
        }

        
        if (password !== user.password) {
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

module.exports = Router;
