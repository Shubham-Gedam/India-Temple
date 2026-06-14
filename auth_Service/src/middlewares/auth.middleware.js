import userModel from "../models/user.model.js";
import config from '../config/config.js'
import jwt from 'jsonwebtoken'

export async function authMiddleware(req,res,next){

    try{

        const token = req.cookies.token;

        if(!token){
            return res.status(401).json({
                message:"Unauthorized"
            });
        }

        const decoded = jwt.verify(
            token,
            config.JWT_SECRET
        );

        req.user = decoded;

        next();

    }catch(error){

        return res.status(401).json({
            message:"Invalid Token"
        });

    }
}

export function adminMiddleware(req, res, next) {

    if (!req.user) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    if (req.user.role !== "admin") {
        return res.status(403).json({
            message: "Access denied. Admin only."
        });
    }

    next();
}