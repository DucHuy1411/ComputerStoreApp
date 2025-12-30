import axios from "axios";

export const API_BASE_URL = "http://192.168.1.57:3001"; // Android emulator: http://10.0.2.2:3001

let authToken = null;

export const setAuthToken = (token) => {
  authToken = token;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 1500,
});

api.interceptors.request.use((config) => {
  if (authToken) config.headers.Authorization = `Bearer ${authToken}`;
  return config;
});

export default api;
