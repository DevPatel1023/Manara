const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const User = require("../models/user.model.js");
const {z} = require("zod");

//register schema
const RegisterSchema = z.object({
    firstName : z.string().min(3,"First Name must be atleast 3 characters long!"),
    lastName : z.string().min(3,"last Name must be atleast 3 characters long!"),
    phoneNo : z.string().length(10),
    email : z.string().email("invalid email"),
    password : z.string().min(6,"Password should be atleast 6 chracters long!"),
})

//login schema
const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long!"),
});
const Signup = async(req,res)=>{
    try {
        const result = RegisterSchema.safeParse(req.body);
        if(!result.success){
            return res.status(400).json({
                msg : "Validation failed",
                errors: result.error.errors,
            });
        }
        const {firstName,lastName,phoneNo,email,password} = result.data;
        const user = await User.findOne({email});
        if(user){
            return res.status(401).json({
                msg : "email is already exist Try different email"
            })
        }

        const hashedPassword = await bcrypt.hash(password,10);
        await User.create({firstName,lastName,phoneNo,email,password:hashedPassword});

        return res.status(200).json({
            msg : "user registered successfully",
            success : true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg : "Internal server error"});
    }
}


const Signin = async(req,res)=>{
    try {
        const result = loginSchema.safeParse(req.body);
        if(!result.success){
            return res.status(400).json({
                msg : "Validation failed",
                errors : result.error.errors,
            })
        }

        const {email,password} = result.data;
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({msg : "Incorrect email Id",success : false})
        }
        const isPassMatched = await bcrypt.compare(password,user.password);
        if(!isPassMatched){
            return res.status(401).json({
                msg : "Incorrect password",
                success : false
            })
        }
        const token = jwt.sign({
            id : user._id,
            email : user.email
        },process.env.JWT_SECRET,{
            expiresIn : "24h"
        })

        return res.status(200).json({
            msg : `Welcome ${user.firstName}`,
            success : true,
            token,user:{
                id : user._id,
                firstName : user.firstName,
                lastName : user.lastName,
                email : user.email
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg :"Internal server error"
        })
    }
}

module.exports = {
    Signin,
    Signup
}