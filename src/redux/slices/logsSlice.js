import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '../store';
import axios from 'axios';

// Thunk: fetch logs from API.
export const fetchReports = createAsyncThunk(
  'logs/fetch',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth?.token;
      const res = await axios.get(`${API_URL}/report/last`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      console.log({ err });

      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch logs');
    }
  }
);

const initialState = {
  items: [], // array of { id, pid, timestamp, level, context, message }
  loading: false,
  error: null,
  lastFetchTs: null, // timestamp of newest log we have
  lastFetchId: null, // id of newest log we have (optional)
  polling: false,
  maxItems: 3000,
};

const logsSlice = createSlice({
  name: 'logs',
  initialState,
  reducers: {
    addReport(state, action) {
      const log = action.payload;
      // avoid duplicates by id if present
      if (log.id && state.items.some((i) => i.id === log.id)) return;
      state.items.push(log);
      if (!state.lastFetchTs || log.timestamp > state.lastFetchTs)
        state.lastFetchTs = log.timestamp;
      if (log.id) state.lastFetchId = log.id;
      // cap size
      if (state.items.length > state.maxItems) {
        state.items.splice(0, state.items.length - state.maxItems);
      }
    },
    clearReports(state) {
      state.items = [];
      state.lastFetchTs = null;
      state.lastFetchId = null;
      state.error = null;
    },
    setPolling(state, action) {
      state.polling = !!action.payload;
    },
    setMaxItems(state, action) {
      state.maxItems = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        const incoming = Array.isArray(action.payload) ? action.payload : [];
        // merge incoming logs, keeping order (assume API returns chronological ascending or descending; adapt if needed)
        // We'll add only new ids/timestamps to avoid duplicates
        const existingIds = new Set(state.items.map((i) => i.id).filter(Boolean));
        const newOnes = incoming.filter((l) => !(l.id && existingIds.has(l.id)));
        // If incoming are older than existing items but you want newest first, you can adjust insertion
        state.items = state.items.concat(newOnes);

        // update lastFetchTs/Id using newest item's timestamp
        const newest = [...state.items].reduce(
          (a, b) => (!a || b.timestamp > a.timestamp ? b : a),
          null
        );
        if (newest) {
          state.lastFetchTs = newest.timestamp;
          if (newest.id) state.lastFetchId = newest.id;
        }
        // cap
        if (state.items.length > state.maxItems) {
          state.items.splice(0, state.items.length - state.maxItems);
        }
        state.loading = false;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { addReport, clearReports, setPolling, setMaxItems } = logsSlice.actions;
export default logsSlice.reducer;

// selectors
export const selectReports = (state) => state.reports.items || [];
export const selectReportsLoading = (state) => state.reports.loading;
export const selectReportsError = (state) => state.reports.error;
export const selectReportsPolling = (state) => state.reports.polling;
export const selectNewestTimestamp = (state) => state.reports.lastFetchTs;
export const selectNewestId = (state) => state.reports.lastFetchId;
