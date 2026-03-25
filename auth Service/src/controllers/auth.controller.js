import userModel from "../models/user.model.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import config from '../config/config.js'
import redis from "../db/redis.js";

export async function registerController(req,res) {
    const {username, email, password, fullname:{ firstname, lastname }} = req.body;

    const isUserAlreadyExists = await userModel.findOne({
        $or:[
            {username},
            {email}
        ]
    });
    if(isUserAlreadyExists){
        return res.status(409).json({
            message:"Username or email already exists"
        })
    };

    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        username,
        email,
        password: hash,
        fullname:{firstname,lastname}
    })

    const token = jwt.sign({
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
    },config.JWT_SECRET,{
        expiresIn:"2d"
    })
    res.cookie("token",token,{
        httpOnly: true,
        secure:true,
        maxAge: 24 * 60 * 60 * 100,
    })

    res.status(201).json({
        message:" User register Succesfully",
        user:{
            id: user._id,
            username: user.username,
            email: user.email,
            fullname: user.fullname,
            role: user.role,
        }
    })
}

export async function loginController(req,res) {
    const { username, email, password} = req.body;


    const user = await userModel.findOne({$or:[{email},{username}]}).select("+password")

    if(!user){
        return res.status(401).json({
            message:"Invalid Credentials"
        })
    }

    const isMatch = await bcrypt.compare(password, user.password || "");

    if(!isMatch){
         return res.status(401).json({
            message:"Invalid Credentials"
        })
    }

    const token = jwt.sign({
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
    },config.JWT_SECRET,{
        expiresIn:"2d"
    })

    res.cookie("token",token,{
        httpOnly: true,
        secure:true,
        maxAge: 24 * 60 * 60 * 100,
    })

    res.status(201).json({
        message:" User register Succesfully",
        user:{
            id: user._id,
            username: user.username,
            email: user.email,
            fullname: user.fullname,
            role: user.role,
        }
    })
}

export async function getCurrentUser(req,res) {
    return res.status(200).json({
        message:"Current user fetch succesfully",
        user:req.user
    })
    
}

export async function logoutController(req,res) {
    const token = req.cookie.token

    if(token){
        await redis.set(`blacklist:${token},`, 'true', 'EX', 24 * 60 * 60)
    }

    res.clearCookie("token",{
        httpOnly: true,
        secure: true
    })

    return res.status(200).json({
        message:"Logged out Succesfully"
    })
}