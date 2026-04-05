const mongoose=require("mongoose");
const Product=require("./models/Product");
const dotenv=require("dotenv");
const User=require("./models/User");
const Cart=require("./models/cart");
const products=require("./data/products");
const connectDB=require("./config/db");

dotenv.config();

const seedData=async()=>{
    try{
        await connectDB();
        
        await Product.deleteMany();
        await User.deleteMany();
        await Cart.deleteMany();
        
        // Use new User() and save() to trigger the password hashing middleware
        const adminUser = new User({
            name: "Admin",
            email: "admin@example.com",
            password: "password",
            role: "admin"
        });
        await adminUser.save();
        const userID = adminUser._id;

        const sampleProducts=products.map(product=>{
            return {
                ...product,
                user: userID,
                gender: product.gender ? product.gender.toLowerCase() : "men",
                collection: product.collections || "Summer Collection",
                discount: product.discountPrice || 0,
                metaTitle: product.name,
                metaDescription: product.description ? product.description.substring(0, 100) : "A great product",
                metaKeywords: "clothing, fashion, nexcart",
                isPublished: true,
                dimensions: {
                    length: 10,
                    width: 5,
                    height: 2
                },
                weight: 0.5
            };
        });
        
        await Product.insertMany(sampleProducts);
        console.log("Data imported successfully");
        process.exit();
    }catch(error){
        console.error("Error importing data:");
        if (error.name === 'ValidationError') {
            for (let field in error.errors) {
                console.error(`- ${field}: ${error.errors[field].message}`);
            }
        } else {
            console.error(error.message);
        }
        process.exit(1);
    }
}
seedData();