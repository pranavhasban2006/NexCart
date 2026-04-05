import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch all orders for the logged-in user
export const fetchUserOrders = createAsyncThunk(
    'orders/fetchUserOrders',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/orders/my-orders`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken") || ""}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Server Error" });
        }
    }
);

// Fetch order details by ID
export const fetchOrderDetails = createAsyncThunk(
    'orders/fetchOrderDetails',
    async (orderId, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/orders/${orderId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken") ? JSON.parse(localStorage.getItem("userToken")) : ""}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Server Error" });
        }
    }
);

const orderSlice = createSlice({
    name: 'orders',
    initialState: {
        orders: [],
        orderDetails: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearOrderDetails: (state) => {
            state.orderDetails = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // fetchUserOrders
            .addCase(fetchUserOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserOrders.fulfilled, (state, action) => {
                state.loading = false;
                // If backend returns { message: "...", orders: [] } when empty, handle it:
                state.orders = action.payload.orders !== undefined ? action.payload.orders : action.payload;
            })
            .addCase(fetchUserOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // fetchOrderDetails
            .addCase(fetchOrderDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrderDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.orderDetails = action.payload;
            })
            .addCase(fetchOrderDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearOrderDetails } = orderSlice.actions;

export default orderSlice.reducer;
