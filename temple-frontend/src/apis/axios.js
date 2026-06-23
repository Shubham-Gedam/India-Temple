import axios from 'axios';

// 🍪 Pure JS helper jo browser ki cookie se bina galti ke token nikalega
const getCookieToken = () => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; token=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

// AUTH SERVICE
export const AUTH_API = axios.create({
  baseURL: import.meta.env.MODE === 'production'
    ? 'https://india-temple.onrender.com/api/auth'
    : 'http://localhost:3000/api/auth',
  withCredentials: true,
});

// TEMPLE SERVICE
export const TEMPLE_API = axios.create({
  baseURL: import.meta.env.MODE === 'production'
    ? 'https://india-temple-1.onrender.com/api/temples'
    : 'http://localhost:3001/api/temples',
  withCredentials: true,
});

// 🌟 Request Interceptor
const attachToken = (config) => {
  // Pehle cookie se token nikalenge
  let token = getCookieToken();

  // Agar cookie mein na mile, toh fallback localStorage (Localhost ke liye)
  if (!token) {
    token = localStorage.getItem('token');
  }
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

AUTH_API.interceptors.request.use(attachToken, (error) => Promise.reject(error));
TEMPLE_API.interceptors.request.use(attachToken, (error) => Promise.reject(error));

export default TEMPLE_API;