const express=require("express");
const router=express.Router();
const Order=require("../models/order");
const{protect}=require("../middleware/authMiddleware");
router.get("/",(req,res)=>{
    res.send("Hello World");
});

//@route GET /api/orders
//@desc Get all orders
//@access private
router.get("/my-orders", protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({
            createdAt: -1
        });
        
        if (!orders || orders.length === 0) {
            return res.status(200).json({ 
                message: "No orders found for this user.",
                userId: req.user._id,
                orders: [] 
            });
        }

        res.status(200).json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

//@route GET /api/orders/:id
//@desc Get order by ID
//@access private
router.get("/:id", protect, async (req, res) => {
    try {
        // Security check: Find the order by ID AND ensure it belongs to the logged-in user
        const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
        if (order) {
            res.status(200).json(order);
        } else {
            res.status(404).json({ message: "Order not found or you do not have permission to view it." });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}); 

module.exports = router;