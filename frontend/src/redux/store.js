import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import orderReducer from "./slices/orderSlice";
import productReducer from "./slices/productsSlice";
// import userReducer from "./slices/userSlice";
import checkoutReducer from "./slices/checkoutSlice";
import adminReducer from "./slices/adminSlice";
import adminproductReducer from "./slices/adminproductSlice";
import adminorderReducer from "./slices/adminorderSlice";
const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer,
        order: orderReducer,
        products: productReducer,
        // user: userReducer,
        checkout: checkoutReducer,
        admin: adminReducer,
        adminProduct: adminproductReducer,
        adminOrder: adminorderReducer
    }
});
export default store;