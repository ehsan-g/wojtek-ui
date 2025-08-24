import axios from 'axios';

// NOTE: localStorage is used here for dev-ease. For production, prefer httpOnly cookies.
const TOKEN_KEY = 'userInfo';

export const setAuthToken = (token) => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } catch (e) {
    console.error('Failed to store token', e);
  }
};

export const getAuthToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (e) {
    return null;
  }
};

export const removeAuthToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    delete axios.defaults.headers.common['Authorization'];
  } catch (e) {
    console.error('Failed to remove token', e);
  }
};
