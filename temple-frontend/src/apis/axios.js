import axios from 'axios';

// AUTH SERVICE
export const AUTH_API = axios.create({
  baseURL: import.meta.env.MODE === 'production'
    ? 'https://india-temple.onrender.com/api/auth'
    : 'http://localhost:3000/api/auth',
  withCredentials: true, // Cookies ko cross-domain receive karne ke liye mandatory
});

// TEMPLE SERVICE
export const TEMPLE_API = axios.create({
  baseURL: import.meta.env.MODE === 'production'
    ? 'https://india-temple-1.onrender.com/api/temples'
    : 'http://localhost:3001/api/temples',
  withCredentials: true, // Doosri render service par cookies propagate karne ke liye mandatory
});

// 🌟 Request Interceptor
const attachToken = (config) => {
  const backupToken = localStorage.getItem('token');
  
  if (backupToken) {
    config.headers.Authorization = `Bearer ${backupToken}`;
  }
  return config;
};

// Interceptors attachment loops
AUTH_API.interceptors.request.use(attachToken, (error) => Promise.reject(error));
TEMPLE_API.interceptors.request.use(attachToken, (error) => Promise.reject(error));

export default TEMPLE_API;