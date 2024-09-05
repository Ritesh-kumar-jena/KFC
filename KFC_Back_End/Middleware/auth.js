const dotenv=require("dotenv").config
const mongoose=require("mongoose")
const jwt=require("jsonwebtoken")
const { users, blackListing } = require("../Model/userModel")

const auth=async(req,res,next)=>{
    try {
        if(req.headers.authorization){
           const token=req.headers.authorization?.split(" ")[1]
           if(token){
               const blacklisted=await blackListing.findOne({token})
               if(blacklisted){
                res.status(400).send("plz login first")
               }else{
                jwt.verify(token,process.env.key,async(err,decoded)=>{
                    if(decoded){
                        const userId=decoded.id
                        const user=await users.findOne({_id:userId})
                        if(user){
                            req.userData=user
                            next()
                        }else{
                            res.status(400).send("user not found in auth middelware")
                        }
                       
                    }else{
                        res.status(400).send("plz login first")
                    }
                 })
               }
            
           }else{res.status(400).send("token missing plz login first")}
        }else{
            res.status(400).send("token missing")
        }
    } catch (error) {
        res.status(400).json(error)
    }
}

module.exports={auth}