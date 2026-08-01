import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/inventory';

// Create a configured axios instance with token
const getAxiosConfig = (thunkAPI) => {
  const token = thunkAPI.getState().auth.token;
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const getInventory = createAsyncThunk('inventory/getAll', async (_, thunkAPI) => {
  try {
    const response = await axios.get(API_URL, getAxiosConfig(thunkAPI));
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.error.message || 'Failed to fetch inventory');
  }
});

export const getReminders = createAsyncThunk('inventory/getReminders', async (_, thunkAPI) => {
  try {
    const response = await axios.get(`${API_URL}/reminders`, getAxiosConfig(thunkAPI));
    return response.data.reminders;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.error.message);
  }
});

const inventorySlice = createSlice({
  name: 'inventory',
  initialState: {
    items: [],
    reminders: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  reducers: {
    resetInventory: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getInventory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getInventory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.items = action.payload.data;
      })
      .addCase(getInventory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getReminders.fulfilled, (state, action) => {
        state.reminders = action.payload;
      });
  }
});

export const { resetInventory } = inventorySlice.actions;
export default inventorySlice.reducer;
