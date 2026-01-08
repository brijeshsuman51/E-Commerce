const jwt = require('jsonwebtoken')
const User = require('../model/user')
const redisClient = require('../config/redisDB')

const adminMiddleware = async (req,res,next) => {
    // console.log("hello")
    try {
    const {token} = req.cookies;
        
    if(!token)
        throw new Error("Invalid Credentials1")

    const payload = jwt.verify(token,process.env.JWT_KEY)

    const {_id} = payload;

    if(!_id)
        throw new Error("Invalid Credentials")

    const result = await User.findById(_id)

    if(!result)
        throw new Error("User doesn`t found")

    if(payload.role !== 'admin')
        throw new Error('Admin access required')

    const IsBlocked = await redisClient.exists(`token:${token}`)

    if(IsBlocked)
        throw new Error("Invalid token")

    req.result = result;

    next()

    } catch (error) {
        res.status(401).send(error.message)
        // console.log(error.message)
    }
}

module.exports = adminMiddleware