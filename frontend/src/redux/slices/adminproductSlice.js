import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

// Create a new product
export const createProduct = createAsyncThunk(
    'adminProduct/createProduct',
    async (productData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/api/products', productData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Server Error" });
        }
    }
);

// Update an existing product
export const updateProduct = createAsyncThunk(
    'adminProduct/updateProduct',
    async ({ id, productData }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/api/products/${id}`, productData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Server Error" });
        }
    }
);

// Delete a product
export const deleteProduct = createAsyncThunk(
    'adminProduct/deleteProduct',
    async (id, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/api/products/${id}`);
            return id; 
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Server Error" });
        }
    }
);

const adminProductSlice = createSlice({
    name: 'adminProduct',
    initialState: {
        loading: false,
        error: null,
        success: false,
    },
    reducers: {
        clearAdminProductError: (state) => {
            state.error = null;
        },
        resetAdminProductState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // createProduct
            .addCase(createProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createProduct.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // updateProduct
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(updateProduct.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // deleteProduct
            .addCase(deleteProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(deleteProduct.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearAdminProductError, resetAdminProductState } = adminProductSlice.actions;

export default adminProductSlice.reducer;
