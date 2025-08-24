import axios from 'axios';
import { getAuthToken, removeAuthToken } from '../utils/authToken';

const baseURL = process.env.REACT_APP_API_URL || process.env.REACT_APP_LOCAL_URL;

const axiosInstance = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: process.env.REACT_APP_USE_COOKIES === 'true',
});

// Request: attach token
axiosInstance.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response: handle auth errors
axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      // token expired or unauthorized: remove token and reload to login
      removeAuthToken();
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;
