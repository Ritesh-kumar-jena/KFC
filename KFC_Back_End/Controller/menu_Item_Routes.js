const dotenv=require("dotenv").config()
const express=require("express")
const mongoose=require("mongoose")
const path=require("path")
const multer=require("multer")
const cloudinary=require("cloudinary").v2
const {CloudinaryStorage}=require("multer-storage-cloudinary")
const { menu } = require("../Model/Menu_Item_Model")
const { auth } = require("../Middleware/auth")
const menuItem=express.Router()

cloudinary.config({
    cloud_name: process.env.cloudName,
    api_key: process.env. APIKEY,
    api_secret: process.env.APISecret
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'kfc_menu', // Folder name in Cloudinary
        allowed_formats: ['jpg', 'png'],
    },
});

const upload = multer({ storage: storage });


menuItem.post("/addItem",auth,upload.single('image'),async(req,res)=>{
    try {
        const items=new menu({
            ...req.body,
            image:req.file.path
        })
        await items.save()
        res.status(200).send("Item added to the menu successfully")
    } catch (error) {
        res.status(400).json(error)
    }
})

menuItem.get("/allItem",async(req,res)=>{
    try {
        const items=await menu.find()
        res.status(200).send(items)
    } catch (error) {
        res.status(400).json(error)
    }
})

menuItem.patch("/editItems/:id",auth,async(req,res)=>{
    try {
        const {id}=req.params
        const data=req.body
        const item=await menu.findOne({_id:id})
        if(item){
            await menu.findByIdAndUpdate({_id:id},data)
            res.status(200).send("item data successfully updated")
        }else{
            res.status(400).send("This item not exisit in our menu")
        }
    } catch (error) {
        res.status(400).json(error)
    }
})

menuItem.delete("/deleteItems/:id",auth,async(req,res)=>{
    try {
        const {id}=req.params
        const item=await menu.findOne({_id:id})
        if(item){
            await menu.findByIdAndDelete({_id:id})
            res.status(200).send("item deleted successfully")
        }else{
            res.status(400).send("This item not exisit in our menu")
        }
    } catch (error) {
        res.status(400).json(error)
    }
})

menuItem.get("/searchItems",async(req,res)=>{
    try {
        const {q}=req.query
        if(q){
            const Length=q.length
            if(Length>=3){
                const itemData=await menu.find({name:{$regex:q,$options:"i"}})
                if(itemData){
                    res.status(200).send(itemData)
                }else{
                    res.status(400).send("No item found")
                }
            }else{
                res.status(200).send("give more data query")
            }
            
        }else{
            res.status(400).send("query not found")
        }
    
    } catch (error) {
        res.status(400).json(error)
    }
})


module.exports={menuItem}