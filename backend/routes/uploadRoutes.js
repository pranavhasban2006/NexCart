const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

// Cloudinary configuration
console.log("Cloudinary Config - Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("Cloudinary Config - API Key:", process.env.CLOUDINARY_API_KEY ? "Present" : "MISSING");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });

// @desc Upload image to cloudinary
// @route POST /api/upload
// @access Private
router.post("/", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const streamUpload = (fileBuffer) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    (error, result) => {
                        if (error) {
                            console.error("Cloudinary Upload Error:", error);
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                );
                streamifier.createReadStream(fileBuffer).pipe(stream);
            });
        };

        const result = await streamUpload(req.file.buffer);
        
        // Return the secure URL and other result details
        res.status(200).json({
            message: "Upload successful",
            url: result.secure_url,
            public_id: result.public_id,
            result: result
        });

    } catch (error) {
        console.error("Upload Route Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;