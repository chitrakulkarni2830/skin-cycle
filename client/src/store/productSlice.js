import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/products';

export const getProducts = createAsyncThunk('products/getAll', async (_, thunkAPI) => {
  try {
    const response = await axios.get(`${API_URL}?limit=100`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch products');
  }
});

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  reducers: {
    resetProducts: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Depending on backend response shape, could be action.payload or action.payload.data
        state.items = action.payload.data || action.payload; 
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  }
});

export const { resetProducts } = productSlice.actions;
export default productSlice.reducer;
