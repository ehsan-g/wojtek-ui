import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import deviceReducer from './slices/deviceSlice';
import notificationReducer from './slices/notificationSlice';
import dataReducer from './slices/dataSlice';
import logsReducer from './slices/logsSlice';

export const API_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_LOCAL_URL;

const store = configureStore({
  reducer: {
    auth: authReducer,
    devices: deviceReducer,
    reports: logsReducer,
    ui: uiReducer,
    notifications: notificationReducer,
    data: dataReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
