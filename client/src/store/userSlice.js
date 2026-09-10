import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const getProfile = createAsyncThunk('user/getProfile', async (userId, thunkAPI) => {
  try {
    const response = await api.get(`/users/${userId}/profile`);
    return response.data.user;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const updateSkinProfile = createAsyncThunk('user/updateSkinProfile', async ({ userId, skinProfileData }, thunkAPI) => {
  try {
    const response = await api.patch(`/users/${userId}/skin-profile`, skinProfileData);
    return response.data.user;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    profile: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
  },
  reducers: {
    resetUser: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.profile = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateSkinProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateSkinProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.profile = action.payload;
      })
      .addCase(updateSkinProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetUser } = userSlice.actions;
export default userSlice.reducer;
