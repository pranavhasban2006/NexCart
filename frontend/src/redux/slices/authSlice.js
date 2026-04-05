import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const userFromStorage = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null;
const tokenFromStorage = localStorage.getItem("userToken") || null;
const initialGuestId = localStorage.getItem("guestId") || `guest_${new Date().getTime()}`;
const initialState = {
    user: userFromStorage,
    userToken: tokenFromStorage,
    guestId: initialGuestId,
    loading: false,
    error: null,
};
export const login = createAsyncThunk("auth/login", async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/login`, userData);
        localStorage.setItem("userInfo", JSON.stringify(response.data.user));
        localStorage.setItem("userToken", response.data.token);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});
//Async THunk for user register
export const register = createAsyncThunk("auth/register", async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/register`, userData);
        localStorage.setItem("userInfo", JSON.stringify(response.data.user));
        localStorage.setItem("userToken", response.data.token);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
});

//slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.userToken = null;
            state.guestId = `guest_${new Date().getTime()}`;
            localStorage.removeItem("userInfo");
            localStorage.removeItem("userToken");
            localStorage.setItem("guestId", state.guestId);
        },
        generateGuestId: (state) => {
            state.guestId = `guest_${new Date().getTime()}`;
            localStorage.setItem("guestId", state.guestId);
        }
    },
    extraReducers: (builder) => {
        builder.addCase(login.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(login.fulfilled, (state, action) => {
            state.user = action.payload.user;
            state.userToken = action.payload.token;
            state.loading = false;
            state.error = null;
        });
        builder.addCase(login.rejected, (state, action) => {
            state.user = null;
            state.userToken = null;
            state.loading = false;
            state.error = action.payload;
        });
        builder.addCase(register.pending, (state) => {
            state.loading = true;
            state.error = null;
            
        });
        builder.addCase(register.fulfilled, (state, action) => {
            state.user = action.payload.user;
            state.userToken = action.payload.token;
            state.loading = false;
            state.error = null;
        });
        builder.addCase(register.rejected, (state, action) => {
            state.user = null;
            state.userToken = null;
            state.loading = false;
            state.error = action.payload;
        });
    }
});
export const { logout, generateGuestId } = authSlice.actions;
export default authSlice.reducer;