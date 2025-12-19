require('dotenv').config();
const createDB=require("./config/db")
createDB();
const express=require("express")
const app=express();
const authRouter=require("./routes/auth");
const adminRouter=require("./routes/admin")
const authMiddleware=require("./middlewares/authMiddleware")
const itemRouter=require("./routes/item")

const cors=require("cors")
app.use(cors())
app.use(express.json())
app.use("/auth",authRouter)
app.use("/admin",authMiddleware,adminRouter)
app.use("/items",itemRouter)

app.listen(process.env.PORT,()=>{
    console.log(`Server running at http://localhost:${process.env.PORT}`)
})