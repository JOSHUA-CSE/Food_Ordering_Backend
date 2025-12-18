const mongoose=require("mongoose")
const itemSchema=new mongoose.Schema(
    {
        name:{
            type:String,
            Required:true
        },
        price:{
            type:Number,
            Required:true
        },
        image:{
            type:String,
            Required:true
        },
        category:{
            type:String,
            enum:["BreakFast","Lunch","Dinner"],
            default:"Dinner",
            Required:true
        },availability:{
            type:String,
            enum:["Currently Available","Not Available"],
            default:"Currently Available",
            required:true
        }
    },
    {timestamps:true}
)
module.exports=mongoose.model("items",itemSchema)