const express=require("express");
const {RegisterUser,login}=require("../controller/authController")

const router=express.Router()

router.post("/register",RegisterUser)
router.post("/login",login)

module.exports=router