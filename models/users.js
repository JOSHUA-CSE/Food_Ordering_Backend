const mongoose=require("mongoose")
const userSchema=new mongoose.Schema(
    {
         name:{
            type:String,
         },
        email:{
            type:String,
            required:true,
        },
        password:{
            type:String,
            required:true,
        },
        role:{
            type:String,
            enum:["student","owner"],
            default:"user",
            required:true
        }
    },
    {timestamps:true}
);

module.exports=mongoose.model("users",userSchema)