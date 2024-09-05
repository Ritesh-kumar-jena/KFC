const dotenv=require("dotenv").config()
const jwt=require("jsonwebtoken")
const mongoose=require("mongoose")
const bcrypt=require("bcrypt")
const express=require("express")
const { users,blackListing } = require("../Model/userModel")
const { userAuth } = require("../Middleware/userAuth")
const { auth } = require("../Middleware/auth")
const userRoute=express.Router()

userRoute.post("/signIn",userAuth,async(req,res)=>{
    try {
      const {name,email,phoneNumber,pass,role}=req.body
       const user=await users.findOne({phoneNumber})
       if(user){
        res.status(200).send({msg:"phone number is allready resister" })
       }
       else{
        bcrypt.hash(pass,5,async function(err,hash){
         if(err){
            res.status(400).send({msg:"error while hashing",err})
         }else{
            const newUser=new users({name,email,phoneNumber,pass:hash,role})
            await newUser.save()
            res.status(200).send("Sign In successfull")
         }
        })
       }
    } catch (error) {
      res.status(400).json(error)
    }
})

userRoute.post("/login",async(req,res)=>{
   try {
      const {phoneNumber,pass}=req.body
      const user=await users.findOne({phoneNumber})
      if(user){
         bcrypt.compare(pass,user.pass,function(err,result){
               if(result){
                  const token=jwt.sign({id:user._id},process.env.key,{expiresIn:"1d"})
                  const reftoken=jwt.sign({id:user._id},process.env.key,{expiresIn:"7d"})
                  res.status(200).send({token:token,reftoken:reftoken})
               }else{
                  res.status(400).send("wrong credentials")
               }
         })
      }else{
          res.status(400).send("user not found plz sign In first")
      }
   } catch (error) {
      res.status(400).json(error)
   }
})

userRoute.get("/logout",async(req,res)=>{
   try {
      if(req.headers.authorization){
         const token=req.headers.authorization?.split(" ")[1]
     const reftoken=req.headers.refreshtoken
     if(token){
         const blacklisted=await blackListing.findOne({token})
         if(blacklisted){
             res.status(200).send("user allready logout")
         }else{
             const blacklistedToken=new blackListing({token})
             blacklistedToken.save()
             if(reftoken){
                 const blacklistedrefToken=await blackListing.findOne({reftoken})
                 if(blacklistedrefToken){
                  return   res.status(200).send("logout successfull")
                 }else{
                     const blacklistedReftoken=new blackListing({reftoken})
                     blacklistedReftoken.save()
                 }  
             }
             res.status(200).send("logout successfull")
         }
     }
     }else{
         res.status(400).send("Token missing")
     }
   } catch (error) {
      res.status(400).json(error)
   }
})

userRoute.patch("/edit/:id",auth,async(req,res)=>{
   try {
      const {id}=req.params
      const userId=req.userData._id
      const data=req.body
      const user=await users.findOne({_id:id})
      if(user){
         if(id===userId.toString()){
            await users.findByIdAndUpdate(id,data)
         res.status(200).send("user update successfully")
         }
         else{
            res.status(200).send("Your not acess to edit this data")
         }
      }else{
         res.status(400).send("user not found")
      }
   } catch (error) {
      res.status(400).json(error)
   }
})

userRoute.delete("/delete/:id",auth,async(req,res)=>{
   try {
      const {id}=req.params
      const userId=req.userData._id
      const user=await users.findOne({_id:id})
      if(user){
         if(id===userId.toString()){
            await users.findByIdAndDelete({_id:id})
         res.status(200).send("user deletee successfully")
         }
         else{
            res.status(200).send("Your not acess to edit this data")
         }
      }else{
         res.status(400).send("user not found")
      }
   } catch (error) {
      res.status(400).json(error)
   }
})

module.exports={userRoute}