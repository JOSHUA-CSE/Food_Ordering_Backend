const express=require("express");
const {getCart, addToCart,updateCart,deleteCart}=require("../controller/cartController")
const router=express.Router()

router.get("/", getCart);
router.post("/", addToCart);
router.put("/", updateCart);
router.delete("/:itemId", deleteCart);



module.exports=router