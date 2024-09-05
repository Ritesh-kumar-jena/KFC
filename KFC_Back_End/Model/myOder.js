const mongoose=require("mongoose")
const { users } = require("./userModel")
const { menu } = require("./Menu_Item_Model")



const orderSchema=mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:"users",required:true},
    items:[{
        menuItems:{type:mongoose.Schema.Types.ObjectId,ref:"menu",required:true},
        quantity:{type:Number,required:true}
    }],
    totalPrice:{type:Number,required:true}
},{versionKey:false})

const orders=mongoose.model("order",orderSchema)

module.exports={orders}