import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

let authToken = null;

export const setAuthToken = (token) => {
  authToken = token;
  if (token) {
    localStorage.setItem('admin_token', token);
  } else {
    localStorage.removeItem('admin_token');
  }
};

export const getAuthToken = () => {
  if (!authToken) {
    authToken = localStorage.getItem('admin_token');
  }
  return authToken;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      setAuthToken(null);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;



