const express=require("express");
const router=express.Router();
const jwt=require("jsonwebtoken");
const User=require("../models/User");
const {protect}=require("../middleware/authMiddleware");

router.post("/register",async(req,res)=>{
    const {name,email,password}=req.body;
    try{
        let user=await User.findOne({email});
        if(user){
            return res.status(400).json({message:"User already exists"});
        }
        user=new User({name,email,password});
        await user.save();
        //create jwt token
        const payload={user:{id:user._id.toString(), role:user.role}};
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "10h" });
        res.status(201).json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        });
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Server error", error: error.message});
    }
});

//routes for login
// @route POST /api/users/login
// @desc Login user
// @access Public
router.post("/login",async(req,res)=>{
    const {email,password}=req.body;
    try{
        let user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"User not found"});
        }
        const isMatch=await user.matchPassword(password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"});
        }
        const payload={user:{id:user._id.toString(), role:user.role}};
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "10h" });
        res.status(200).json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        });
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Server error", error: error.message});
    }
});
//route for user profile
// @route GET /api/users/profile
// @desc Get user profile
// @access Private
router.get("/profile",protect,async(req,res)=>{
    try{
        const user=await User.findById(req.user.id).select("-password");
        res.json(user);
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Server error", error: error.message});
    }
});
module.exports=router;