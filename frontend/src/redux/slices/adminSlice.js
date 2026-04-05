import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

// --- User Management Thunks ---

export const fetchUsers = createAsyncThunk(
    'admin/fetchUsers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/api/admin/users');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Server Error" });
        }
    }
);

export const createUser = createAsyncThunk(
    'admin/createUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/api/admin/users', userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Server Error" });
        }
    }
);

export const updateUserRole = createAsyncThunk(
    'admin/updateUserRole',
    async (updateData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put('/api/admin/users', updateData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Server Error" });
        }
    }
);

export const deleteUser = createAsyncThunk(
    'admin/deleteUser',
    async (id, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/api/admin/users?id=${id}`);
            return id; 
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Server Error" });
        }
    }
);

// --- Product Management Thunks ---

export const fetchAllProducts = createAsyncThunk(
    'admin/fetchAllProducts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/api/admin/products');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Server Error" });
        }
    }
);

// --- Order Management Thunks ---

export const fetchAllOrders = createAsyncThunk(
    'admin/fetchAllOrders',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/api/admin/orders');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Server Error" });
        }
    }
);

export const updateOrderStatus = createAsyncThunk(
    'admin/updateOrderStatus',
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/api/admin/orders/${id}`, { status });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Server Error" });
        }
    }
);

export const deleteOrder = createAsyncThunk(
    'admin/deleteOrder',
    async (id, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/api/admin/orders/${id}`);
            return id; 
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Server Error" });
        }
    }
);

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        users: [],
        products: [],
        orders: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearAdminError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // fetchUsers
            .addCase(fetchUsers.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchUsers.fulfilled, (state, action) => { state.loading = false; state.users = action.payload; })
            .addCase(fetchUsers.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            // createUser
            .addCase(createUser.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(createUser.fulfilled, (state, action) => { 
                state.loading = false; 
                state.users.push(action.payload.user); 
            })
            .addCase(createUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            // updateUserRole
            .addCase(updateUserRole.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(updateUserRole.fulfilled, (state, action) => { 
                state.loading = false; 
                const index = state.users.findIndex(user => user._id === action.payload._id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
            })
            .addCase(updateUserRole.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            // deleteUser
            .addCase(deleteUser.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(deleteUser.fulfilled, (state, action) => { 
                state.loading = false; 
                state.users = state.users.filter(user => user._id !== action.payload);
            })
            .addCase(deleteUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            // fetchAllProducts
            .addCase(fetchAllProducts.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchAllProducts.fulfilled, (state, action) => { state.loading = false; state.products = action.payload; })
            .addCase(fetchAllProducts.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            // fetchAllOrders
            .addCase(fetchAllOrders.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchAllOrders.fulfilled, (state, action) => { state.loading = false; state.orders = action.payload; })
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

export const { clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;
