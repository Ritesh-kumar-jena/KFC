const mongoose=require("mongoose")


const userSchema=mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    phoneNumber:{type:String,required:true},
    pass:{type:String,required:true},
    role:{
        type:String,
        required:true,
        default:"viwer",
        enum:["admin","viwer"]
    }
},{versionKey:false})

const users=mongoose.model("user",userSchema)

const blacklistingSchema=mongoose.Schema({
    token:{type:String},
    reftoken:{type:String}
},{versionKey:false})

const blackListing=mongoose.model("blackList",blacklistingSchema)

module.exports={users,blackListing}