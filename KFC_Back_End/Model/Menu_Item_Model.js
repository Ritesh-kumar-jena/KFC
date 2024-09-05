const mongoose=require("mongoose")

const menuItemSchema=mongoose.Schema({
    name:{type:String,required:true},
    descriptions:{type:String,required:true},
    type:{type:String,required:true},
    price:{type:Number,required:true},
    image:{type:String,required:true}
},{versionKey:false})

const menu=mongoose.model("MenuItem",menuItemSchema)

module.exports={menu}