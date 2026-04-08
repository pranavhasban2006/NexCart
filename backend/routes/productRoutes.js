const express=require("express");
const Product=require("../models/Product");
const {protect,admin}=require("../middleware/authMiddleware");
const router=express.Router();
// @route POST /api/products
// @desc Create a new product
// @access Private/admin
router.post("/",protect,admin,async(req,res)=>{
    try{
        const {name,description,price,discount,sku,category,brand,rating,numReviews,countInStock,sizes,colors,collectionName,material,gender,images,altText,isFeatured,isPublished,tags,metaTitle,metaDescription,metaKeywords,dimensions,weight}= req.body;
        const product = new Product({
            name,
            description,
            price,
            discount,
            sku,
            category,
            brand,
            rating,
            numReviews,
            countInStock,
            sizes,
            colors,
            collectionName,
            material,
            gender,
            images,
            altText,
            isFeatured,
            isPublished,
            tags,
            metaTitle,
            metaDescription,
            metaKeywords,
            dimensions,
            weight,
            user: req.user.id
        });
        const createdProduct=await product.save();
        res.status(201).json(createdProduct);
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Server error", error: error.message});
    }
});


//@route PUT/api/products/:id
//@desc Update a product
//@access Private/admin
router.put("/:id",protect,admin,async(req,res)=>{
    try{
        const {name,description,price,discount,sku,category,brand,rating,numReviews,countInStock,sizes,colors,collectionName,material,gender,images,altText,isFeatured,isPublished,tags,user,metaTitle,metaDescription,metaKeywords,dimensions,weight}= req.body;
        const product = await Product.findById(req.params.id);
        if(product){
            product.name=name || product.name;
            product.description=description || product.description;
            product.price=price || product.price;
            product.discount=discount || product.discount;
            product.sku=sku || product.sku;
            product.category=category || product.category;
            product.brand=brand || product.brand;
            product.rating=rating || product.rating;
            product.numReviews=numReviews || product.numReviews;
            product.countInStock=countInStock || product.countInStock;
            product.sizes=sizes || product.sizes;
            product.colors=colors || product.colors;
            product.collectionName=collectionName || product.collectionName;
            product.material=material || product.material;
            product.gender=gender || product.gender;
            product.images=images || product.images;
            product.altText=altText || product.altText;
            product.isFeatured=isFeatured !==undefined ? isFeatured : product.isFeatured;
            product.isPublished=isPublished !==undefined ? isPublished : product.isPublished;
            product.tags=tags || product.tags;
            product.user=user || product.user;
            product.metaTitle=metaTitle || product.metaTitle;
            product.metaDescription=metaDescription || product.metaDescription;
            product.metaKeywords=metaKeywords || product.metaKeywords;
            product.dimensions=dimensions || product.dimensions;
            product.weight=weight || product.weight;
            //save to db
            const updatedProduct=await product.save();
            res.json(updatedProduct);
        }else{
            res.status(404).json({message:"Product not found"});
        }
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Server error", error: error.message});
    }
});
//@route delete/api/products/:id
//@desc Delete a product
//@access Private/admin
router.delete("/:id",protect,admin,async(req,res)=>{
    try{
        const product = await Product.findById(req.params.id);
        if(product){
            await product.deleteOne();
            res.json({message:"Product removed"});
        }else{
            res.status(404).json({message:"Product not found"});
        }
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Server error", error: error.message});
    }
});
//@route GET/api/products
//@desc Fetch all products
//@access Public
router.get("/",async(req,res)=>{
    try{
        const {collectionName, gender,size,color,minPrice,maxPrice,sortBy,search, category,material,brand,limit}=req.query;
        const query={};
        //filter logic
        if(collectionName && collectionName.toLowerCase() !=='all'){
            query.collectionName=collectionName;
        }
        if(gender && gender.toLowerCase() !=='all'){
            query.gender=gender.toLowerCase();
        }
        if(size && size.toLowerCase() !=='all'){
            query.sizes={$in: size.split(",")};
        }
        if(color && color.toLowerCase() !=='all'){
            query.colors={$in: color.split(",")};
        }
        if(minPrice) query.price={$gte:Number(minPrice)};

        if(maxPrice) query.price={$lte:Number(maxPrice)};
        if(search) query.$or    =[{name:{$regex:search,$options:"i"}},{description:{$regex:search,$options:"i"}}];
    
        if(category && category.toLowerCase() !=='all'){
            query.category={$in: category.split(",")};
        }
        if(material && material.toLowerCase() !=='all'){
            query.material={$in: material.split(",")};
        }
        if(brand && brand.toLowerCase() !=='all'){
            query.brand={$in: brand.split(",")};
        }
        let sort={};
        if(sortBy){
            switch(sortBy){
                case "price-asc":
                    sort={price:1};
                    break;
                case "price-desc":
                    sort={price:-1};
                    break;
                case "popularity":
                    sort={numReviews:-1};
                    break;
                default:
                    sort={createdAt:-1};
            }
        }
        //fetch products from db
        const products=await Product.find(query).sort(sort).limit(Number(limit)||0);
        res.json(products);
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Server error", error: error.message});
    }
});

//@route GET/api/products/categories
//@desc Fetch all categories
//@access Public
router.get("/categories",async(req,res)=>{
    try{
        const categories=await Product.distinct("category");
        res.json(categories);
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Server error", error: error.message});
    }
});

//@route GET/api/products/similar/:id
//@desc Fetch similar products based on current product gender and category
//@access Public
router.get("/similar/:id",async(req,res)=>{
    const {id}=req.params;
    try{
        const product=await Product.findById(id);
        if(product){
            const similarProducts=await Product.find({

                gender:product.gender,
                category:product.category,
                _id:{$ne:id}
            }).limit(4);
            res.json(similarProducts);
        }else{
            res.status(404).json({message:"Product not found"});
        }
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Server error", error: error.message});
    }
});

//@route GET/api/products/best-sellers
//@desc Fetch best selling products highest ratting
//@access Public
router.get("/best-sellers", async (req, res) => {
    try {
        // Fetch products sorted by highest rating and most reviews
        const bestSellers = await Product.find().sort({ rating: -1, numReviews: -1 }).limit(10);
        if (!bestSellers || bestSellers.length === 0) {
            return res.status(404).json({ message: "No best sellers found" });
        } else {
            res.json(bestSellers);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});
//@route GET/api/products/new-arrivals
//@desc Fetch new arrivals products
//@access Public
router.get("/new-arrivals",async(req,res)=>{
    try{
        const newArrivals=await Product.find().sort({createdAt:-1}).limit(8 );
        if(!newArrivals){
            return res.status(404).json({message:"No new arrivals found"});
        }else{
            res.json(newArrivals);
        }
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Server error", error: error.message});
    }
});

//@route GET/api/products/:id
//@desc Fetch a product
//@access Public
router.get("/:id",async(req,res)=>{
    try{
        const product = await Product.findById(req.params.id);
        if(product){
            res.json(product);
        }else{
            res.status(404).json({message:"Product not found"});
        }
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Server error", error: error.message});
    }
});

module.exports = router;