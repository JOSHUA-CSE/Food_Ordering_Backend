
const User=require("../models/users")
const bcrypt = require("bcrypt")
const jwt=require("jsonwebtoken")
const RegisterUser = async (req, res) => {
    try {
        const {name,email,password,role}=req.body
        if (!email || !password) {
            return res.status(400).json({message:"Email and password are required"})
        }
        const existingUser=await User.findOne({email})
        if(existingUser){
            return res.status(400).json({message:"User already exists"})
        }
        const hashedPassword=await bcrypt.hash(String(password),10)
        const safeRole=role && ["student","owner"].includes(role)?role:"student";
        const user = await User.create({name,email,password:hashedPassword,role:safeRole})
        res.json({message:"User registered successfully",user})
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

const login = async (req, res) => {
    try {
        const {email,password}=req.body
        if (!email || !password) {
            return res.status(400).json({message:"Email and password are required"})
        }
        const user = await User.findOne({email})
        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }
        const isPasswordValid=await bcrypt.compare(String(password),user.password)
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" })
        }
        const token=jwt.sign(
            {id:user._id,email:user.email},
            process.env.SECRET_KEY,
            {expiresIn:process.env.JWT_EXPIRES_IN}
        )
        res.json({message:"User logged in successfully",token,userId:user._id,role:user.role})
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

module.exports={RegisterUser,login}