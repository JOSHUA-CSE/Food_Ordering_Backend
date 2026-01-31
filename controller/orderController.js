const Order=require("../models/orders")
const Cart=require("../models/carts")
const Item=require("../models/items")

const placeOrder=async(req,res)=>{
    try{
        const cart=await Cart.findOne({user:req.userData.id}).populate("items.item")
        if(!cart || cart.items.length===0){
            return res.status(400).json({error:"Cart is empty"})
        }
        
        const orderItems=cart.items.map(cartItem=>({
            item:cartItem.item._id,
            quantity:cartItem.quantity,
            price:cartItem.item.price
        }))
        
        const totalAmount=orderItems.reduce((sum,item)=>sum+(item.price*item.quantity),0)
        
        const order=await Order.create({
            user:req.userData.id,
            items:orderItems,
            totalAmount:totalAmount
        })
        
        await Cart.findOneAndUpdate(
            {user:req.userData.id},
            {items:[]}
        )
        
        res.status(201).json({message:"Order placed successfully",order})
    }catch(err){
        res.status(500).json({error:"Failed to place order",details:err.message})
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

module.exports={placeOrder,getUserOrders,getAllOrders}
