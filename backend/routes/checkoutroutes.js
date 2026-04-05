const express = require("express");
const Checkout = require("../models/checkout");
const Cart = require("../models/cart");
const Product = require("../models/Product");
const router = express.Router();
const Order = require("../models/order");
const { protect } = require("../middleware/authMiddleware");

//@route post /api/checkout
//@desc create checkout session
//@access private
router.post("/", protect, async (req, res) => {
    // Safety check for req.body existence
    if (!req.body) {
        return res.status(400).json({ message: "Request body is missing. Ensure you are sending JSON." });
    }

    let { checkoutItems, shippingAddress, paymentMethod, totalPrice } = req.body;

    if (!checkoutItems || checkoutItems.length === 0) {
        return res.status(400).json({ message: "Checkout items are required" });
    }

    try {
        const newCheckout = await Checkout.create({
            user: req.user.id,
            checkoutItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
            paymentStatus: "pending",
            isPaid: false,
        });

        console.log(`Checkout created for user ${req.user.id}`);
        res.status(201).json(newCheckout);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

//@route put /api/checkout/:id/pay
//@desc update checkout to paid
//@access private
router.put("/:id/pay", protect, async (req, res) => {
    const { paymentStatus, paymentDetails } = req.body;
    try {
        const checkout = await Checkout.findById(req.params.id);
        if (!checkout) {
            return res.status(404).json({ message: "Checkout not found" });
        }

        if (paymentStatus === "paid") {
            checkout.paymentStatus = paymentStatus;
            checkout.paymentDetails = paymentDetails;
            checkout.isPaid = true;
            checkout.paidAt = Date.now();
            await checkout.save();
            res.status(200).json(checkout);
        } else {
            return res.status(400).json({ message: "Invalid payment status" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

//@route post /api/checkout/:id/finalize
//@desc confirm checkout and convert to order after payment confirmation
//@access private
router.post("/:id/finalize", protect, async (req, res) => {
    try {
        const checkout = await Checkout.findById(req.params.id);
        if (!checkout) {
            return res.status(404).json({ message: "Checkout not found" });
        }

        if (checkout.isPaid && !checkout.isFinalized) {
            // Convert checkout to Final Order
            const finalOrder = await Order.create({
                user: checkout.user,
                orderItems: checkout.checkoutItems.map(item => ({
                    productId: item.productId,
                    name: item.name,
                    image: item.image,
                    price: item.price,
                    quantity: item.quantity || 1, // Ensure quantity exists
                    size: item.size || "M",       // Default size if not provided
                    color: item.color || "Black"  // Default color if not provided
                })),
                shippingAddress: checkout.shippingAddress,
                paymentMethod: checkout.paymentMethod,
                totalPrice: checkout.totalPrice,
                paymentStatus: checkout.paymentStatus,
                isPaid: checkout.isPaid,
                paidAt: checkout.paidAt,
                status: "processing"
            });

            // Mark checkout as finalized
            checkout.isFinalized = true;
            checkout.finalizedAt = Date.now();
            await checkout.save();

            // DELETE the cart associated with the user after successful order
            await Cart.findOneAndDelete({ user: req.user.id });

            res.status(200).json(finalOrder);
        } else if (!checkout.isPaid) {
            return res.status(400).json({ message: "Checkout not paid" });
        } else if (checkout.isFinalized) {
            return res.status(400).json({ message: "Checkout already finalized" });
        } else {
            return res.status(400).json({ message: "Invalid checkout status" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;