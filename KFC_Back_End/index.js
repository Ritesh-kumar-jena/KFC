const dotenv=require("dotenv").config()
const express=require("express")
const cors=require("cors")
const { connection } = require("./db")
const { userRoute } = require("./Controller/usersRoutes")
const { menuItem } = require("./Controller/menu_Item_Routes")
const { myorder } = require("./Controller/myOrder_Routes")



const port=process.env.port

const app=express()

app.use(express.json())
app.use(cors())

app.get("/",(req,res)=>{
    res.send("Wllcome to KFC")
})

app.use("/user",userRoute)

app.use("/menu",menuItem)

app.use("/orders",myorder)

app.listen(port,async()=>{
    try {
        await connection
        console.log(`server connected to KFC database and running on port:-${port}`)
    } catch (error) {
        console.log(error)
    }
})