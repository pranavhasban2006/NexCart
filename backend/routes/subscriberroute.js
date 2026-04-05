const express = require("express");
const router = express.Router();
const Subscriber = require("../models/subscriber");

// @route POST /api/subscribe
// @desc Handle newsletter subscription
// @access Public
router.post("/", async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        // Check if subscriber already exists
        const existingSubscriber = await Subscriber.findOne({ email });
        
        if (existingSubscriber) {
            return res.status(400).json({ message: "Email is already subscribed" });
        }

        // Create new subscriber
        const newSubscriber = await Subscriber.create({ email });
        
        res.status(201).json({ 
            message: "Email subscribed successfully",
            subscriber: newSubscriber 
        });
    } catch (error) {
        console.error("Subscription Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;