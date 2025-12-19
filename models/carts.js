const mongoose=require("mongoose")
const cartSchema=new mongoose.Schema(
    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"users",
            required:true,
        },
        items:[
            {
                _id:{type:mongoose.Schema.Types.ObjectId,auto:true},
                item:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"items",
                    required:true,
                },
                quantity:{type:Number,required:true,min:1,default:1}
            }
        ]
    },
    {timestamps:true});

module.exports=mongoose.model("carts",cartSchema)
