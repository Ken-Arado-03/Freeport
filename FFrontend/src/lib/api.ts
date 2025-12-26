import axios from 'axios';

const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh or logout on 401, and unwrap API responses
api.interceptors.response.use(
  (response) => {
    // Unwrap Laravel API responses that have { success, message, data } structure
    if (response.data && typeof response.data === 'object' && 'data' in response.data && 'success' in response.data) {
      return {
        ...response,
        data: response.data.data,
      };
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userType');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
