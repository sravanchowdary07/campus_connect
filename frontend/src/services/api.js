import axios from 'axios';

const API = axios.create({
  baseURL: '/api'
});

// Interceptor to add JWT token header
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('campusconnect_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;
