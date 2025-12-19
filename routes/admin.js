const express=require("express");
const { addItem, getItem, updateItem, deleteItem } = require("../controller/adminController");

const router=express.Router()

router.post("/", addItem);
router.get("/:id", getItem);
router.put("/:id", updateItem);
router.delete("/:id",deleteItem)


module.exports=router