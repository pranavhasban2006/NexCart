import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch all orders
export const fetchAllOrders = createAsyncThunk(
    'adminOrder/fetchAllOrders',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/orders`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("userToken") || ""}`
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Server Error" });
        }
    }
);

// Update order status
export const updateOrderStatus = createAsyncThunk(
    'adminOrder/updateOrderStatus',
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/orders/${id}`, { status }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("userToken") ? JSON.parse(localStorage.getItem("userToken")) : ""}`
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Server Error" });
        }
    }
);

// Delete an order
export const deleteOrder = createAsyncThunk(
    'adminOrder/deleteOrder',
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/orders/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("userToken") ? JSON.parse(localStorage.getItem("userToken")) : ""}`
                }
            });
            return id; 
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Server Error" });
        }
    }
);

const adminOrderSlice = createSlice({
    name: 'adminOrder',
    initialState: {
        orders: [],
        totalSales: 0,
        totalOrders: 0,
        loading: false,
        error: null,
    },
    reducers: {
        clearAdminOrderError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // fetchAllOrders
            .addCase(fetchAllOrders.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchAllOrders.fulfilled, (state, action) => { 
                state.loading = false; 
                state.orders = action.payload; 
                state.totalOrders = action.payload.length;
                // Calculate total sales dynamically based strictly on paid orders
                state.totalSales = action.payload.reduce((acc, order) => {
                    return order.isPaid ? acc + order.totalPrice : acc;
                }, 0);
            })
            .addCase(fetchAllOrders.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            // updateOrderStatus
            .addCase(updateOrderStatus.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.orders.findIndex(order => order._id === action.payload._id);
                if (index !== -1) {
                    state.orders[index] = action.payload;
                }
            })
            .addCase(updateOrderStatus.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            // deleteOrder
            .addCase(deleteOrder.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(deleteOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = state.orders.filter(order => order._id !== action.payload);
            })
            .addCase(deleteOrder.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
    }
});

export const { clearAdminOrderError } = adminOrderSlice.actions;
export default adminOrderSlice.reducer;
