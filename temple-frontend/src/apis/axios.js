import axios from 'axios';

// 1. AUTH SERVICE INSTANCE (Port 3000 + base path '/api/auth')
export const AUTH_API = axios.create({
  baseURL: 'http://localhost:3000/api/auth', 
  withCredentials: true,
});

// 2. TEMPLE SERVICE INSTANCE (Port 3001 + base path '/api/temples')
export const TEMPLE_API = axios.create({
  baseURL: 'http://localhost:3001/api/temples', 
  withCredentials: true,
});

// Request Interceptor: Dono servers par token authorization verify karne ke liye
const attachToken = (config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

AUTH_API.interceptors.request.use(attachToken, (error) => Promise.reject(error));
TEMPLE_API.interceptors.request.use(attachToken, (error) => Promise.reject(error));

const API = TEMPLE_API;
export default API;