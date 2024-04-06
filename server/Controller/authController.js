const jwt = require('jsonwebtoken')

const authMiddleware = async (req,res,next)=>{
    let token;
if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    // Extract token from Authorization header
    token = req.headers.authorization.split(' ')[1];
} else {
    // Handle case where Authorization header is missing or has incorrect format
    return res.status(401).json({
        status: "Failed",
        message: "Unauthorized: Missing or invalid token"
    });
}
    try{
        const decode = jwt.verify(token,process.env.JWT_SECRET)
        if(decode.userId){
            req.userId = decode.userId
            next();
        }

    } catch(e){
        res.status(403).json({
            status:"Failed"
        })
    }
}
module.exports = authMiddleware