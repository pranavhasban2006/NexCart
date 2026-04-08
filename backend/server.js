const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const express=require("express");
const cors=require("cors");
const connectDB=require("./config/db");
const userRoutes=require("./routes/userRoutes");
const productRoutes=require("./routes/productRoutes");
const cartRoutes=require("./routes/cartRoutes");
const checkoutRoutes=require("./routes/checkoutroutes");
const orderRoutes=require("./routes/orderroutes");
const uploadRoutes=require("./routes/uploadRoutes");
const subscriberRoutes=require("./routes/subscriberroute");
const adminRoutes=require("./routes/adminroutes");
const productadminroutes=require("./routes/productadminroutes");
const adminorderroutes=require("./routes/adminorderroutes");

const app=express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// route registration
app.use("/api/cart",cartRoutes);
app.use("/api/checkout",checkoutRoutes);
app.use("/api/orders",orderRoutes);
app.use("/api/upload",uploadRoutes);
app.use("/api/subscribe",subscriberRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/admin/products",productadminroutes);
app.use("/api/admin/orders",adminorderroutes);
app.use("/api/users",userRoutes);
app.use("/api/products",productRoutes);

app.get("/",(req,res)=>{
    res.send("Hello World");
});

const PORT=process.env.PORT || 9000;

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT,()=>{
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to connect to DB", error);
        process.exit(1);
    }
};

startServer();