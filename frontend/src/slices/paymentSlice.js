// src/slices/paymentSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// createAsyncThunk vasitəsilə PaymentIntent yaradılır
export const createPaymentIntent = createAsyncThunk(
  'payment/createPaymentIntent',
  async ({ amount, currency }, thunkAPI) => {
    try {
      // Backend-ə POST sorğusu göndərilir.
      // Əgər backend fərqli portda işləyirsə və ya baseURL tələb olunursa, burada düzəliş edin.
      const response = await axios.post('http://localhost:3010/commerce/mehsullar/products/create-payment-intent', { amount, currency });
      // Cavab: { clientSecret: '...' }
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState: {
    loading: false,
    clientSecret: null,
    error: null,
  },
  reducers: {
    resetPaymentState: (state) => {
      state.loading = false;
      state.clientSecret = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPaymentIntent.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.clientSecret = null;
      })
      .addCase(createPaymentIntent.fulfilled, (state, action) => {
        state.loading = false;
        state.clientSecret = action.payload.clientSecret;
      })
      .addCase(createPaymentIntent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;
