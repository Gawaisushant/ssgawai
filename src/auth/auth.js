const User = require("../models/Register");
const jwt = require("jsonwebtoken");

const Authenticate = async( req , res , next) => {
    try {
        const token = req.cookies.jwtoken ;
        console.log(token)
        const verifyToken = jwt.verify(token, process.env.SECREAT_KEY)
        const rootUser = await User.findOne({_id:verifyToken._id });
        if (!rootUser) {throw new Error("user not found")};
        req.token = token ;
        req.rootUser = rootUser ;
        req.userID = rootUser._id ;
        
        next()
    } catch (error) {
        res.status(401).send("unauthorized : No token provided");
        console.log(error)
    }
}
module.exports = Authenticate ;
