import {createSlice,createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

const loadCartFromStorage = () => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : { products: [] };
};

//fetch cart for a user or guest
export const fetchCart=createAsyncThunk("cart/fetchCart",async({userId,guestId},{rejectWithValue})=>{
    try{
        const params = userId ? { userId } : { guestId };
        const response=await axios.get(`${import.meta.env.VITE_API_URL}/api/cart`, { params });
        return response.data;
    }catch(error){
        return rejectWithValue(error.response.data);
    }
});
//add an item to the cart for a guest or user
export const addToCart=createAsyncThunk("cart/addToCart",async({userId,productId,quantity,price,color,size,guestId},{rejectWithValue})=>{
    try{
        const response=await axios.post(`${import.meta.env.VITE_API_URL}/api/cart`,{
            productId,
            quantity,
            price,
            guestId,
            userId,
            color,
            size

        });
        return response.data;
    }catch(error){
        return rejectWithValue(error.response.data);
    }
});

//update the quantity of an item in the cart for a guest or user
export const updateCartItemQuantity=createAsyncThunk("cart/updateCartItemQuantity",async({userId,productId,quantity,guestId,size,color},{rejectWithValue})=>{
    try{
        const response=await axios.put(`${import.meta.env.VITE_API_URL}/api/cart`,{
            productId,
            quantity,
            guestId,
            userId,
            size,
            color
        });
        return response.data;
    }catch(error){
        return rejectWithValue(error.response.data);
    }
});

//remove an item from the cart for a guest or user
export const removeFromCart=createAsyncThunk("cart/removeFromCart",async({userId,productId,guestId,size,color},{rejectWithValue})=>{
    try{
        const response=await axios.delete(`${import.meta.env.VITE_API_URL}/api/cart`,{
            data:{
                productId,
                guestId,
                userId,
                size,
                color
            }
        });
        return response.data;
    }catch(error){
        return rejectWithValue(error.response.data);
    }
});
//merge cart for a guest user when they login
export const mergeCart=createAsyncThunk("cart/mergeCart",async({userId,guestId},{rejectWithValue})=>{
    try{
        const response=await axios.post(`${import.meta.env.VITE_API_URL}/api/cart/merge`,{
            guestId,
            userId
        },
    {
        headers:{
            "Authorization": `Bearer ${localStorage.getItem("userToken") || ""}`
        }
    });
        return response.data;
    }catch(error){
        return rejectWithValue(error.response.data);
    }
});

const cartSlice=createSlice({
    name:"cart",
    initialState:{
        cart: loadCartFromStorage(),
        loading: false,
        error: null
    },
    reducers:{
        clearCart:(state)=>{
            localStorage.removeItem("cart");
            state.cart=[];
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(fetchCart.pending,(state)=>{
            state.loading=true;
        })
        .addCase(fetchCart.fulfilled,(state,action)=>{
            state.loading=false;
            state.cart=action.payload;
        })
        .addCase(fetchCart.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        })
        .addCase(addToCart.pending,(state)=>{
            state.loading=true;
        })
        .addCase(addToCart.fulfilled,(state,action)=>{
            state.loading=false;
            state.cart=action.payload;
        })
        .addCase(addToCart.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        })
        .addCase(updateCartItemQuantity.pending,(state)=>{
            state.loading=true;
        })
        .addCase(updateCartItemQuantity.fulfilled,(state,action)=>{
            state.loading=false;
            state.cart=action.payload;
        })
        .addCase(updateCartItemQuantity.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        })
        .addCase(removeFromCart.pending,(state)=>{
            state.loading=true;
        })
        .addCase(removeFromCart.fulfilled,(state,action)=>{
            state.loading=false;
            state.cart=action.payload;
        })
        .addCase(removeFromCart.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        })
        .addCase(mergeCart.pending,(state)=>{
            state.loading=true;
        })
        .addCase(mergeCart.fulfilled,(state,action)=>{
            state.loading=false;
            state.cart=action.payload;
        })
        .addCase(mergeCart.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        })
    }
});
export const {clearCart}=cartSlice.actions;
export default cartSlice.reducer;