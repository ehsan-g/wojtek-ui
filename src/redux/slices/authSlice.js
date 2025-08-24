// src/redux/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../services/axiosInstance';
import { setAuthToken, removeAuthToken } from '../../utils/authToken';
import jwtDecode from 'jwt-decode';

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await axios.post('/auth/login', { username: email, password });
      return res.data; // expect { token }
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async ({ firstName, lastName, email, password }, { rejectWithValue }) => {
    try {
      console.log('Submitting...'); // 🔍
      const res = await axios.post('/auth/register', { firstName, lastName, email, password });
      return res.data; // expect { token }
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      removeAuthToken();
    },
    setUserFromToken(state, action) {
      state.token = action.payload;
      try {
        state.user = jwtDecode(action.payload);
      } catch (e) {
        state.user = null;
      }
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(login.fulfilled, (s, action) => {
        const token = action.payload?.access_token;
        if (token) {
          s.token = token;
          setAuthToken(token);
          try {
            s.user = jwtDecode(token);
          } catch (e) {
            s.user = null;
          }
        }
        s.loading = false;
      })
      .addCase(login.rejected, (s, action) => {
        s.loading = false;
        s.error = action.payload?.message || 'Login failed';
      })
      .addCase(register.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(register.fulfilled, (s, action) => {
        const token = action.payload?.token;
        if (token) {
          s.token = token;
          setAuthToken(token);
          try {
            s.user = jwtDecode(token);
          } catch (e) {
            s.user = null;
          }
        }
        s.loading = false;
      })
      .addCase(register.rejected, (s, action) => {
        console.log('Login rejected:', action.payload);

        s.loading = false;
        s.error = action.payload?.message || 'Registration failed';
      });
  },
});

export const { logout, clearError, setUserFromToken } = authSlice.actions;
export default authSlice.reducer;
