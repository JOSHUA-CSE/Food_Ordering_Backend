const express=require("express");
const {placeOrder,createPaymentOrder,verifyPayment,getUserOrders,getAllOrders}=require("../controller/orderController")
const router=express.Router()

router.post("/", placeOrder);
router.post("/create-payment", createPaymentOrder);
router.post("/verify", verifyPayment);
router.get("/", getUserOrders);
router.get("/all", getAllOrders);

module.exports=router
