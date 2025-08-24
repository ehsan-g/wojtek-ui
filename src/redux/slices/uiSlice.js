// src/redux/slices/uiSlice.js
import { createSlice } from '@reduxjs/toolkit';

const saved = localStorage.getItem('themeMode') || 'dark';

const uiSlice = createSlice({
  name: 'ui',
  initialState: { themeMode: saved, isLoading: false },
  reducers: {
    toggleTheme(state) {
      state.themeMode = state.themeMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', state.themeMode);
    },
    startLoading(state) {
      state.isLoading = true;
    },
    stopLoading(state) {
      state.isLoading = false;
    },
    setTheme(state, action) {
      state.themeMode = action.payload;
      localStorage.setItem('themeMode', state.themeMode);
    },
  },
});

export const { toggleTheme, startLoading, stopLoading, setTheme } = uiSlice.actions;
export default uiSlice.reducer;
