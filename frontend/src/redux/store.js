import { configureStore } from "@reduxjs/toolkit";
import { productApi } from "./api/productsApi";
import { authApi } from "./api/authApi";
import paymentReducer from '../slices/paymentSlice'; // paymentSlice import edildi
import userSlice from "./features/userSlice"; // userSlice import edildi

export const store = configureStore({
  reducer: {
    [productApi.reducerPath]: productApi.reducer, // productApi reducer əlavə edildi
    [authApi.reducerPath]: authApi.reducer, 
    payment: paymentReducer,
    userSlice: userSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([productApi.middleware, authApi.middleware,]), // API middleware-lər əlavə edildi

});