import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/routines';

const getAxiosConfig = (thunkAPI) => {
  const token = thunkAPI.getState().auth.token;
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const getRoutines = createAsyncThunk('routines/getAll', async (_, thunkAPI) => {
  try {
    const response = await axios.get(API_URL, getAxiosConfig(thunkAPI));
    return response.data.routines;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.error.message);
  }
});

export const createRoutine = createAsyncThunk('routines/create', async (routineData, thunkAPI) => {
  try {
    const response = await axios.post(API_URL, routineData, getAxiosConfig(thunkAPI));
    return response.data.routine;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.error.message);
  }
});

const routineSlice = createSlice({
  name: 'routines',
  initialState: {
    routines: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
  },
  reducers: {
    resetRoutines: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRoutines.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRoutines.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.routines = action.payload;
      })
      .addCase(getRoutines.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createRoutine.fulfilled, (state, action) => {
        state.routines.push(action.payload);
      });
  }
});

export const { resetRoutines } = routineSlice.actions;
export default routineSlice.reducer;
