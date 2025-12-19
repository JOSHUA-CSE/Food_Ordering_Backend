const express=require("express");
const {getItem,getItems}=require("../controller/itemController")
const router=express.Router()

router.get("/", getItems);
router.get("/:id", getItem);


module.exports=router