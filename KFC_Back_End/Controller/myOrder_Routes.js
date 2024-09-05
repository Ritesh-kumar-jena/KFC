const express=require("express")
const mongoose=require("mongoose")
const { orders } = require("../Model/myOder")
const { auth } = require("../Middleware/auth")
const { menu } = require("../Model/Menu_Item_Model")
const myorder=express.Router()


myorder.get("/allOders",async(req,res)=>{
    try {
        const order=await orders.find()
        if(order.length>0){
            res.status(200).send(order)
        }else{
            res.status(404).send("you are not oder any item till now so plz order at list one item.")
        }
    } catch (error) {
        res.status(400).json(error)
    }
})

myorder.get("/myOders",auth,async(req,res)=>{
    try {
        const userId=req.userData._id
        const order=await orders.find({user:userId}).populate('items.menuItems')
        if(order.length>0){
            res.status(200).send(order)
        }else{
            res.status(404).send("you are not oder any item till now so plz order at list one item.")
        }
    } catch (error) {
        res.status(400).json(error)
    }
})

myorder.post("/addOrders",auth,async(req,res)=>{
    try {
        const user=req.userData._id
        const {items}=req.body 
        let totalPrice=0
        for(const item of items){
            const menuItem=await menu.findOne({_id:item.menuItems})
            if(menuItem){
                totalPrice+=menuItem.price*item.quantity
            }
            else{
                return res.status(404).send("Item not found")
            }
        }
        
        const newOrders=new orders({user:user,items:items,totalPrice:totalPrice})
       await newOrders.save()
       res.status(200).send({msg:"Order placed successfully",order:newOrders})
    } catch (error) {
        res.status(400).json(error)
    }
})


myorder.patch("/editOders/:id",async(req,res)=>{
    try {
       const {id} =req.params
       const data=req.body
       const myOders=await orders.findOne({_id:id})
       if(myOders){
           await orders.findByIdAndUpdate({_id:id},data)
           res.status(200).send("order data edited successfully")
       }else{
        res.status(404).send("order not found")
       }
    } catch (error) {
        res.status(400).json(error)
    }
})

myorder.delete("/deleteOders/:id",async(req,res)=>{
    try {
        const {id}=req.params
        const myOders=await orders.findOne({_id:id})
        if(myOders){
            await orders.findByIdAndDelete({_id:id})
            res.status(200).send("order data deleted successfully")
        }else{
            res.status(404).send("order not found")
        }
    } catch (error) {
        res.status(400).json(error)
    }
})

module.exports={myorder}