const express = require("express");
const User = require("../models/User");
const Order = require("../models/order");
const Product = require("../models/Product");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { protect, admin } = auth;

//@route GET /api/admin/users
//@desc Get all users
//@access Private/admin
router.get("/users", protect, admin, async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

//@route POST /api/admin/users
//@desc create a new user(admin only)
//@access Private/admin
router.post("/users", protect, admin, async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        
        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Create new user
        const user = new User({
            name,
            email,
            password,
            role: role || "customer"
        });

        const createdUser = await user.save();
        res.status(201).json({
            message: "User created successfully",
            user: {
                id: createdUser._id,
                name: createdUser.name,
                email: createdUser.email,
                role: createdUser.role
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


//@route PUT /api/admin/users
//@desc update user (admin only) - name, email, and role
//@access Private/admin
router.put("/users", protect, admin, async (req, res) => {
    try {
        const { id, name, email, password, role } = req.body;
        
        if (!id) {
            return res.status(400).json({ message: "User ID is required in the request body" });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        user.name = name || user.name;
        user.email = email || user.email;
        user.password = password || user.password;
        user.role = role || user.role;
        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

//@route DELETE /api/admin/users
//@desc delete user (admin only)
//@access Private/admin
router.delete("/users", protect, admin, async (req, res) => {
    try {
        const id = req.query.id || req.body.id;
        
        if (!id) {
            return res.status(400).json({ message: "User ID is required in the query parameters or body" });
        }

        const user = await User.findByIdAndDelete(id);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User successfully removed" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

//@route GET /api/admin/stats
//@desc Get dashboard statistics
//@access Private/admin
router.get("/stats", protect, admin, async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalUsers = await User.countDocuments();
        
        // Calculate total revenue from all orders
        const orders = await Order.find();
        const totalRevenue = orders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);
        
        // Fetch 6 recent orders, populating user name
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(6)
            .populate("user", "name");
            
        res.json({
            totalOrders,
            totalProducts,
            totalUsers,
            totalRevenue: parseFloat(totalRevenue.toFixed(2)),
            recentOrders
        });
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;