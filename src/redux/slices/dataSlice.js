// src/redux/slices/dataSlice.js
import { createSlice } from '@reduxjs/toolkit';

const dataSlice = createSlice({
  name: 'data',
  initialState: { items: [], loading: false, error: null },
  reducers: {
    setItems(state, action) {
      state.items = action.payload;
    },
    clearItems(state) {
      state.items = [];
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setItems, clearItems, setLoading, setError } = dataSlice.actions;
export default dataSlice.reducer;
