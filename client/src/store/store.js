import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import inventoryReducer from './inventorySlice';
import routineReducer from './routineSlice';
import productReducer from './productSlice';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    inventory: inventoryReducer,
    routines: routineReducer,
    products: productReducer,
    user: userReducer,
  },
});
