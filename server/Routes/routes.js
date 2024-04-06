const express = require('express')
const bankRouter = require('./bankRoutes')
const userRouter = require('./userRoutes')

const Router = express.Router();


Router.use('/user',userRouter);
Router.use('/account',bankRouter)

module.exports = Router

