const dotenv=require("dotenv").config()

const userAuth=(req,res,next)=>{
    const {phoneNumber}=req.body
    if(phoneNumber.length===10){
        next()
    }else{
        res.status(400).send("wrong Phone Number")
    }
}



module.exports={userAuth}