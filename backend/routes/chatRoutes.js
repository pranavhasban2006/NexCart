const express = require('express');
const router = express.Router();
const { GoogleGenAI } = require('@google/genai');
const Product = require('../models/Product');

router.post('/', async (req, res) => {
    try {
        const { messages, cart } = req.body;
        
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ message: "GEMINI_API_KEY not configured on server." });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        // Retrieve product catalog context
        const latestProducts = await Product.find({ isPublished: true }).limit(20).select('name price category');
        const catalogContext = latestProducts.map(p => `- ${p.name} (${p.category}): $${p.price}`).join('\n');

        // Format Cart context
        let cartContext = 'Cart is currently empty.';
        if (cart && cart.cartItems && cart.cartItems.length > 0) {
            cartContext = cart.cartItems.map(item => `- ${item.name} x${item.qty} ($${item.price})`).join('\n');
            cartContext += `\nTotal Price: $${cart.totalPrice}`;
        }

        const systemPrompt = `You are an AI assistant for the NexCart e-commerce application. 
You help users with their shopping experience, answer product questions, and provide recommendations based on available context.

Here is the context of the user's current session:
### User's Shopping Cart
${cartContext}

### Featured & Available Products Catalog
${catalogContext ? catalogContext : 'No products loaded.'}

Respond in a concise, friendly, and helpful tone. Format responses with markdown for readability.`;

        // Format history for Gemini API
        const formattedMessages = messages.map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
        }));

        const responseStream = await ai.models.generateContentStream({
            model: 'gemini-2.5-flash',
            contents: formattedMessages,
            config: {
                systemInstruction: systemPrompt
            }
        });

        // Use text stream
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Transfer-Encoding', 'chunked');

        for await (const chunk of responseStream) {
            if (chunk.text) {
                res.write(chunk.text);
            }
        }
        res.end();

    } catch (error) {
        console.error("Chat API Error:", error);
        res.status(500).json({ message: "Failed to communicate with AI." });
    }
});

module.exports = router;
