const express = require('express')

const userRouter = require('./userRoutes')

const Router = express.Router();


Router.use('/user',userRouter);

module.exports = Router

