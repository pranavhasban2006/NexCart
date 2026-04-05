const express=require("express");
const router=express.Router();
const Order=require("../models/order");
const {protect,admin}=require("../middleware/authMiddleware");

//@route GET//api/admin/orders
//@desc get all orders(admin only)
//@access Private/admin
router.get("/",protect,admin,async(req,res)=>{
    try {
        const orders=await Order.find();
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});
//@route put//api/admin/orders/:id
//@desc update order status(admin only)
//@access Private/admin
router.put("/:id",protect,admin,async(req,res)=>{
    try {
        const {id}=req.params;
        const {status}=req.body;
        const order=await Order.findById(id);
        if(!order){
            return res.status(404).json({ message: "Order not found" });
        }
        order.status=status;
        order.isDelivered=req.body.status==="delivered"?true:order.isDelivered;
        order.deliveredAt=req.body.status==="delivered"?Date.now():order.deliveredAt;
        const updatedOrder=await order.save();
        res.json(updatedOrder);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});
//@route delete//api/admin/orders/:id
//@desc delete order(admin only)
//@access Private/admin
router.delete("/:id",protect,admin,async(req,res)=>{
    try {
        const {id}=req.params;
        const order=await Order.findByIdAndDelete(id);
        if(!order){
            return res.status(404).json({ message: "Order not found" });
        }
        res.json({ message: "Order successfully deleted" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});
module.exports=router;