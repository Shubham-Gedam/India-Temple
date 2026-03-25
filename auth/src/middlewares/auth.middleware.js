import userModel from "../models/user.model.js";
import config from '../config/config.js'
import jwt from 'jsonwebtoken'

export async function authMiddleware(req,res, next) {
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({
            message:"Unauthorized"
        })
    }

    try {
        const decoded = jwt.verify(token , config.JWT_SECRET )

        const user =decoded

        req.user = user

        next()
    } catch (error) {
         return res.status(401).json({
            message:"Unauthorized"
        })
    }
}