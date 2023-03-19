import jwt from "jsonwebtoken";
import UserModel from "../models/User.js";

var checkUserAuth = async (req, res, next) => {
    let token;
    const { authorization } = req.headers;
    console.log(authorization)
    
    if (authorization && authorization.startsWith('Bearer')) {
        try {
            //get token from headers
            token = authorization.split(' ')[1]//at the 0th index has bearer and token present in the 1th index
            //verify token
            const { userID } = jwt.verify(token, process.env.JWT_SECRET_KEY)
            console.log(userID);
            //get user from token
            req.user = await UserModel.findById(userID).select('-password')
            next()

        }
        catch (err) {
            console.log(err)
            res.status(401).send({ status: "failed", message: 'Unauthorized User' })
        }
    }
    if (!token) {
        res.status(401).send({ status: "failed", message: 'Unauthorized User , No token available' })
    }
}
export default checkUserAuth

