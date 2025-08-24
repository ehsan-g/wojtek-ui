import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../store';

// thunk: get my devices
export const fetchMyDevices = createAsyncThunk(
  'devices/fetchMyDevices',
  async (_, { getState }) => {
    const token = getState().auth.token;
    const res = await axios.get(`${API_URL}/device/my`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }
);

// thunk: create new device
export const createDevice = createAsyncThunk(
  'devices/createDevice',
  async (deviceData, { getState }) => {
    const token = getState().auth.token;
    const res = await axios.post(`${API_URL}/device`, deviceData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  }
);

// async thunk to delete device
export const deleteDevice = createAsyncThunk(
  'devices/delete',
  async (deviceId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth?.token;
      await axios.delete(`${API_URL}/device/${deviceId}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      // return id to let reducer remove it from local store
      return deviceId;
    } catch (err) {
      // normalize error
      const errMsg = err.response?.data?.message || err.message || 'Delete failed';
      return rejectWithValue(errMsg);
    }
  }
);

const deviceSlice = createSlice({
  name: 'devices',
  initialState: {
    devices: [],
    loading: false,
    deletingIds: [],
    error: null,
  },
  reducers: {
    // optional helper to set devices (on fetch)
    setDevices(state, action) {
      state.items = action.payload;
    },
    // optimistic remove if you prefer
    removeDeviceLocally(state, action) {
      state.items = state.items.filter((d) => d.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyDevices.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyDevices.fulfilled, (state, action) => {
        state.loading = false;
        state.devices = action.payload.map((d) => ({
          ...d,
          reportCount: Number(d.reportCount), // ✅ ensure it's a number
        }));
      })
      .addCase(createDevice.fulfilled, (state, action) => {
        state.devices.push(action.payload);
      })
      .addCase(deleteDevice.fulfilled, (state, action) => {
        const id = action.payload;
        state.devices = state.devices.filter((d) => d.id !== id);
        state.deletingIds = state.deletingIds.filter((x) => x !== id);
      })
      .addCase(deleteDevice.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
        state.deletingIds = state.deletingIds.filter((x) => x !== action.meta.arg);
      });
  },
});

export const { setDevices, removeDeviceLocally } = deviceSlice.actions;
export default deviceSlice.reducer;
