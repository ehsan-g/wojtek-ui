// src/redux/slices/notificationSlice.js
import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: { list: [] },
  reducers: {
    pushNotification(state, action) {
      state.list.push(action.payload);
    },
    popNotification(state) {
      state.list.shift();
    },
    clearNotifications(state) {
      state.list = [];
    },
  },
});

export const { pushNotification, popNotification, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
