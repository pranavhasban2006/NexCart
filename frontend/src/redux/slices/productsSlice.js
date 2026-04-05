import {createSlice,createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

export const fetchProductsByFilters= createAsyncThunk("products/fetchProductsByFilters",async({
    category,
    brand,
    order,
    page,
    limit,
    collection,
    size,
    color,
    gender,
    minPrice,
    maxPrice,
    sortBy,
    search,
    material
    
})=>{
    const query = new URLSearchParams();
    if(category) query.append("category",category);
    if(brand) query.append("brand",brand);
    if(order) query.append("order",order);
    if(page) query.append("page",page);
    if(limit) query.append("limit",limit);
    if(collection) query.append("collection",collection);
    if(size) query.append("size",size);
    if(color) query.append("color",color);
    if(gender) query.append("gender",gender);
    if(minPrice) query.append("minPrice",minPrice);
    if(maxPrice) query.append("maxPrice",maxPrice);
    if(sortBy) query.append("sortBy",sortBy);
    if(search) query.append("search",search);
    if(material) query.append("material",material);
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products?${query.toString()}`);
    return response.data;
});

export const fetchProductDetails=createAsyncThunk("products/fetchProductDetails",async({id})=>{
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
    return response.data;
});

//async thunk to  update product views
export const updateProductViews=createAsyncThunk("products/updateProductViews",async({id,productData})=>{
    const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/products/${id}`,productData,{
        headers:{
            Authorization: `Bearer ${localStorage.getItem("userToken") || ""}`,
        }
    });
    return response.data;
});

//Async thunk to fetch similar products
export const fetchSimilarProducts=createAsyncThunk("products/fetchSimilarProducts",async({id})=>{
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/similar/${id}`);
    return response.data;
});

const productsSlice=createSlice({
    name:"products",
    initialState:{
        products:[],
        product:[],
        selectedProducts:[],
        similarProducts:[],
        loading:false,
        error:null,
        filters:{
            category:"",
            brand:"",
            order:"",
            page:1,
            limit:10,
            collection:"",
            size:"",
            color:"",
            gender:"",
            minPrice:"",
            maxPrice:"",
            sortBy:"",
            search:"",
            material:"",
        }
    },
    reducers:{
        setProducts:(state,action)=>{
            state.products=action.payload;
        },
        setProduct:(state,action)=>{
            state.product=action.payload;
        },
        setSelectedProducts:(state,action)=>{
            state.selectedProducts=action.payload;
        },
        setSimilarProducts:(state,action)=>{
            state.similarProducts=action.payload;
        },
    },
    extraReducers:(builder)=>{
        builder
        .addCase(fetchProductsByFilters.pending,(state)=>{
            state.loading=true;
        })
        .addCase(fetchProductsByFilters.fulfilled,(state,action)=>{
            state.loading=false;
            state.products=action.payload;
        })
        .addCase(fetchProductsByFilters.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        })
        .addCase(fetchProductDetails.pending,(state)=>{
            state.loading=true;
        })
        .addCase(fetchProductDetails.fulfilled,(state,action)=>{
            state.loading=false;
            state.product=action.payload;
        })
        .addCase(fetchProductDetails.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        })
        .addCase(updateProductViews.pending,(state)=>{
            state.loading=true;
        })
        .addCase(updateProductViews.fulfilled,(state,action)=>{
            state.loading=false;
            state.product=action.payload;
        })
        .addCase(updateProductViews.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        })
        .addCase(fetchSimilarProducts.pending,(state)=>{
            state.loading=true;
        })
        .addCase(fetchSimilarProducts.fulfilled,(state,action)=>{
            state.loading=false;
            state.similarProducts=action.payload;
        })
        .addCase(fetchSimilarProducts.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        })
    }
});
export const {setProducts,setProduct,setSimilarProducts,setSelectedProducts}=productsSlice.actions;
export default productsSlice.reducer;