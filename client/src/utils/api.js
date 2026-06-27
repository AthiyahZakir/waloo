// Central axios instance — uses VITE_API_URL in production, 
// falls back to relative path for local dev (handled by Vite proxy)
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
});

// Attach JWT token to every request automatically if one exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;