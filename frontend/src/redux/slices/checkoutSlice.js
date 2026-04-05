import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

// 1. Create a checkout session
export const createCheckout = createAsyncThunk(
    'checkout/createCheckout',
    async (checkoutData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/api/checkout', checkoutData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Server Error" });
        }
    }
);

// 2. Pay for checkout
export const payCheckout = createAsyncThunk(
    'checkout/payCheckout',
    async ({ checkoutId, paymentStatus, paymentDetails }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/api/checkout/${checkoutId}/pay`, { paymentStatus, paymentDetails });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Server Error" });
        }
    }
);

// 3. Finalize checkout (convert to Order)
export const finalizeCheckout = createAsyncThunk(
    'checkout/finalizeCheckout',
    async (checkoutId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/api/checkout/${checkoutId}/finalize`, {});
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Server Error" });
        }
    }
);

const checkoutSlice = createSlice({
    name: 'checkout',
    initialState: {
        checkout: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearCheckout: (state) => {
            state.checkout = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // createCheckout
            .addCase(createCheckout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCheckout.fulfilled, (state, action) => {
                state.loading = false;
                state.checkout = action.payload;
            })
            .addCase(createCheckout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // payCheckout
            .addCase(payCheckout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(payCheckout.fulfilled, (state, action) => {
                state.loading = false;
                state.checkout = action.payload; // Update checkout with payment details
            })
            .addCase(payCheckout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // finalizeCheckout
            .addCase(finalizeCheckout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(finalizeCheckout.fulfilled, (state, action) => {
                state.loading = false;
                state.checkout = action.payload; // Returns the finalized order from the backend
            })
            .addCase(finalizeCheckout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearCheckout } = checkoutSlice.actions;

export default checkoutSlice.reducer;
