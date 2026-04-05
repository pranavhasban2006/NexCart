const express=require("express");
const router=express.Router();
const Product=require("../models/Product");
const {protect,admin}=require("../middleware/authMiddleware");

//@route GET//api/admin/products
//@desc get all products(admin only)
//@access Private/admin
router.get("/",protect,admin,async(req,res)=>{
    try {
        const products=await Product.find();
        res.json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});
module.exports=router;