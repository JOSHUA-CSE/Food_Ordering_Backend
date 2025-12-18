const express=require("express");
const { addItem, updateItem } = require("../controller/adminController");

const router=express.Router()

router.post("/", addItem);
router.put("/:id", updateItem);


module.exports=router