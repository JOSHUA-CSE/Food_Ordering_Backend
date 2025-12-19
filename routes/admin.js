const express=require("express");
const { addItem, getItem, updateItem } = require("../controller/adminController");

const router=express.Router()

router.post("/", addItem);
router.get("/:id", getItem);
router.put("/:id", updateItem);


module.exports=router