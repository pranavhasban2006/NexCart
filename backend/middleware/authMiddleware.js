const jwt=require("jsonwebtoken");
const User=require("../models/User");
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            // Extraction
            token = req.headers.authorization.split(" ")[1];

            if (!token || token === "null" || token === "undefined") {
                return res.status(401).json({ message: "Not authorized: Token missing or invalid in header" });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            if (!decoded || !decoded.user || !decoded.user.id) {
                return res.status(401).json({ message: "Not authorized: Invalid token structure" });
            }

            req.user = await User.findById(decoded.user.id).select("-password");

            if (!req.user) {
                return res.status(401).json({ message: "Not authorized: User no longer exists" });
            }

            // SUCCESS: Proceed to next middleware
            return next();
        } catch (error) {
            console.error("JWT Verification Error:", error.message);
            const message = error.name === "TokenExpiredError" ? "Not authorized: Token expired" : "Not authorized: Token failed";
            return res.status(401).json({ message, error: error.message });
        }
    }

    if (!token) {
        return res.status(401).json({ message: "Not authorized: No token provided in headers" });
    }
};
// middleware to check if the user is admin
const admin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        return next(); // SUCCESS: Call next and stop here
    } else {
        return res.status(403).json({ message: "Not authorized as admin. Access denied." });
    }
};

module.exports = { protect, admin };