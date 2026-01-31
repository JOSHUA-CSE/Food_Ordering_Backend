const Order=require("../models/orders")
const Cart=require("../models/carts")
const crypto = require("crypto")
const Razorpay = require("razorpay")

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})

const buildOrderFromCart = async (userId) => {
    const cart = await Cart.findOne({ user: userId }).populate("items.item")
    if (!cart || cart.items.length === 0) {
        return { error: "Cart is empty" }
    }

    const orderItems = cart.items
        .filter((cartItem) => cartItem.item)
        .map(cartItem => ({
            item: cartItem.item._id,
            quantity: cartItem.quantity,
            price: cartItem.item.price
        }))

    if (orderItems.length === 0) {
        return { error: "Cart has invalid items" }
    }

    const totalAmount = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    return { cart, orderItems, totalAmount }
}

const placeOrder = async (req, res) => {
    try {
        const { paymentMethod } = req.body
        if (paymentMethod && paymentMethod !== "COD") {
            return res.status(400).json({ error: "Invalid payment method" })
        }

        const { orderItems, totalAmount, error } = await buildOrderFromCart(req.userData.id)
        if (error) {
            return res.status(400).json({ error })
        }

        const order = await Order.create({
            user: req.userData.id,
            items: orderItems,
            totalAmount,
            paymentMethod: "COD",
            paymentStatus: "PENDING",
            orderStatus: "PLACED"
        })

        await Cart.findOneAndUpdate(
            { user: req.userData.id },
            { items: [] }
        )

        res.status(201).json({ message: "Order placed successfully", order })
    } catch (err) {
        res.status(500).json({ error: "Failed to place order", details: err.message })
    }
}

const createPaymentOrder = async (req, res) => {
    try {
        const { cart, orderItems, totalAmount, error } = await buildOrderFromCart(req.userData.id)
        if (error) {
            return res.status(400).json({ error })
        }

        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(totalAmount * 100),
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
            notes: {
                userId: req.userData.id
            }
        })

        res.status(200).json({
            orderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            keyId: process.env.RAZORPAY_KEY_ID,
            totalAmount
        })
    } catch (err) {
        res.status(500).json({ error: "Failed to create payment order", details: err.message })
    }
}

const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ error: "Payment verification payload missing" })
        }

        const body = `${razorpay_order_id}|${razorpay_payment_id}`
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex")

        const isValid = expectedSignature === razorpay_signature

        const { orderItems, totalAmount, error } = await buildOrderFromCart(req.userData.id)
        if (error) {
            return res.status(400).json({ error })
        }

        if (!isValid) {
            const failedOrder = await Order.create({
                user: req.userData.id,
                items: orderItems,
                totalAmount,
                paymentMethod: "ONLINE",
                paymentStatus: "FAILED",
                paymentId: razorpay_payment_id,
                orderStatus: "PLACED"
            })
            return res.status(400).json({ error: "Payment verification failed", order: failedOrder })
        }

        const order = await Order.create({
            user: req.userData.id,
            items: orderItems,
            totalAmount,
            paymentMethod: "ONLINE",
            paymentStatus: "PAID",
            paymentId: razorpay_payment_id,
            orderStatus: "PLACED"
        })

        await Cart.findOneAndUpdate(
            { user: req.userData.id },
            { items: [] }
        )

        res.status(201).json({ message: "Payment verified and order placed", order })
    } catch (err) {
        res.status(500).json({ error: "Payment verification failed", details: err.message })
    }
}

const getUserOrders=async(req,res)=>{
    try{
        const orders=await Order.find({user:req.userData.id})
            .populate("items.item")
            .sort({createdAt:-1})
        res.status(200).json({orders})
    }catch(err){
        res.status(500).json({error:"Failed to fetch orders",details:err.message})
    }
}

const getAllOrders=async(req,res)=>{
    try{
        const orders=await Order.find()
            .populate("user","name email")
            .populate("items.item")
            .sort({createdAt:-1})
        res.status(200).json({orders})
    }catch(err){
        res.status(500).json({error:"Failed to fetch orders",details:err.message})
    }
}

module.exports = { placeOrder, createPaymentOrder, verifyPayment, getUserOrders, getAllOrders }
