const express = require("express");
const Cart = require("../models/cart");
const Product = require("../models/Product");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");


//helper function to get cart for a user
const getCart = async (userId, guestId) => {
    if (userId) {
        return await Cart.findOne({ user: userId });
    } else {
        return await Cart.findOne({ guestId: guestId });
    }
}
//@route post /api/cart
//@desc add to cart for a guest or logged in user
//@access public
router.post("/", async (req, res) => {
    let { productId, product_id, quantity, size, color, guestId, guest_id, userId, user_id } = req.body;
    productId = productId || product_id;
    guestId = guestId || guest_id;
    userId = userId || user_id;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        //determine if the user is guest or logged in
        let cart = await getCart(userId, guestId);
        //if cart exists update it
        if (cart) {
            const productIndex = cart.products.findIndex((item) => item.productId.toString() === productId && item.size === size && item.color === color);
            if (productIndex > -1) {
                cart.products[productIndex].quantity += quantity;
            } else {
                cart.products.push({
                    productId,
                    quantity,
                    size,
                    color,
                    name: product.name,
                    image: product.images[0].url,
                    price: product.price
                });
            }
            cart.totalPrice = cart.products.reduce((total, item) => total + item.price * item.quantity, 0);
            await cart.save();
            res.status(200).json(cart);
        }
        else {
            //create new cart
            const newCart = await Cart.create({
                user: userId ? userId : undefined,
                guestId: guestId ? guestId : "guest_" + new Date().getTime(),
                products: [
                    {
                        productId,
                        quantity,
                        size,
                        color,
                        name: product.name,
                        image: product.images[0].url,
                        price: product.price
                    }
                ],
                totalPrice: product.price * quantity,
            });

            res.status(201).json(newCart);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

//@route put /api/cart
//@desc update cart item
//@access public
router.put("/", async (req, res) => {
    let { productId, product_id, quantity, size, color, guestId, guest_id, userId, user_id } = req.body;
    productId = productId || product_id;
    guestId = guestId || guest_id;
    userId = userId || user_id;

    try {
        const cart = await getCart(userId, guestId);
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        const productIndex = cart.products.findIndex((item) => item.productId.toString() === productId && item.size === size && item.color === color);
        if (productIndex > -1) {
            if (quantity > 0) {
                cart.products[productIndex].quantity = quantity;
            } else {
                cart.products.splice(productIndex, 1);
            }
        }
        else {
            return res.status(404).json({ message: "Product not found in cart" });
        }
        cart.totalPrice = cart.products.reduce((total, item) => total + item.price * item.quantity, 0);
        await cart.save();
        res.status(200).json(cart);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


//@route delete /api/cart
//@desc delete cart item
//@access public
router.delete("/", async (req, res) => {
    let { productId, product_id, size, color, guestId, guest_id, userId, user_id } = req.body;
    productId = productId || product_id;
    guestId = guestId || guest_id;
    userId = userId || user_id;

    try {
        const cart = await getCart(userId, guestId);
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        const productIndex = cart.products.findIndex((item) => item.productId.toString() === productId && item.size === size && item.color === color);
        if (productIndex > -1) {
            cart.products.splice(productIndex, 1);
            cart.totalPrice = cart.products.reduce((total, item) => total + item.price * item.quantity, 0);
            await cart.save();
            res.status(200).json(cart);
        }
        else {
            return res.status(404).json({ message: "Product not found in cart" });
        }


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

//@route get /api/cart
//@desc get cart
//@access public
router.get("/", async (req, res) => {
    let { guestId, guest_id, userId, user_id } = req.query;
    // Fallback to req.body just for testing flexibility
    guestId = guestId || guest_id || req.body.guestId || req.body.guest_id;
    userId = userId || user_id || req.body.userId || req.body.user_id;

    try {
        const cart = await getCart(userId, guestId);
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        res.status(200).json(cart);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

//@route post /api/cart/merge
//@desc merge cart guest cart into user cart on login
//@access private
router.post("/merge", protect, async (req, res) => {
    let { guestId, guest_id } = req.body;
    guestId = guestId || guest_id;

    console.log("Attempting merge for Guest ID:", guestId);
    console.log("Logged In User ID:", req.user.id);

    try {
        const guestCart = await Cart.findOne({ guestId });
        const userCart = await Cart.findOne({ user: req.user.id });

        if (guestCart) {
            console.log("Guest cart found with", guestCart.products.length, "items");
            if (guestCart.products.length === 0) {
                return res.status(400).json({ message: "Guest cart is empty" });
            }

            if (userCart) {
                console.log("Merging guest items into user cart");
                // Merge guest cart products into user cart
                guestCart.products.forEach((guestItem) => {
                    const productIndex = userCart.products.findIndex(
                        (userItem) =>
                            userItem.productId.toString() === guestItem.productId.toString() &&
                            userItem.size === guestItem.size &&
                            userItem.color === guestItem.color
                    );

                    if (productIndex > -1) {
                        userCart.products[productIndex].quantity += guestItem.quantity;
                    } else {
                        userCart.products.push(guestItem);
                    }
                });

                userCart.totalPrice = userCart.products.reduce((total, item) => total + item.price * item.quantity, 0);
                await userCart.save();
                await Cart.findOneAndDelete({ guestId });
                res.status(200).json(userCart);
            } else {
                console.log("Transferring guest cart to user identity");
                // No user cart, just transfer guest cart to user
                guestCart.user = req.user.id;
                guestCart.guestId = undefined;
                await guestCart.save();
                res.status(200).json(guestCart);
            }
        } else {
            console.log("Merge failed: No guest cart found for ID:", guestId);
            // No guest cart found, return user cart if it exists
            if (userCart) {
                return res.status(200).json(userCart);
            }
            return res.status(404).json({ message: `No guest cart found for ID: ${guestId}` });
        }
    } catch (error) {
        console.error("Merge error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
