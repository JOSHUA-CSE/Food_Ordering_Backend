const express=require("express");
const {placeOrder,getUserOrders,getAllOrders}=require("../controller/orderController")
const router=express.Router()

router.post("/", placeOrder);
router.get("/", getUserOrders);
router.get("/all", getAllOrders);

module.exports=router
