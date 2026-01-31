const mongoose=require("mongoose")
const orderSchema=new mongoose.Schema(
    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"users",
            required:true,
        },
        items:[
            {
                item:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"items",
                    required:true,
                },
                quantity:{type:Number,required:true,min:1},
                price:{type:Number,required:true}
            }
        ],
        totalAmount:{
            type:Number,
            required:true
        },
        paymentMethod: {
            type: String,
            enum: ["COD", "ONLINE"],
            default: "COD",
            required: true
        },
        paymentStatus: {
            type: String,
            enum: ["PENDING", "PAID", "FAILED"],
            default: "PENDING",
            required: true
        },
        paymentId: {
            type: String,
            default: null
        },
        orderStatus: {
            type: String,
            enum: ["PLACED", "CONFIRMED", "PREPARING", "DELIVERED"],
            default: "PLACED",
            required: true
        }
    },
    {timestamps:true}
)

module.exports=mongoose.model("orders",orderSchema)
