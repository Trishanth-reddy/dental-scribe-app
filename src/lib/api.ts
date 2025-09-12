import axios from 'axios';

const api = axios.create({
  // UPDATE: Point to your live Render backend URL
  baseURL: 'https://backend-dental-uwt7.onrender.com/api',
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, error => Promise.reject(error));

export default api;