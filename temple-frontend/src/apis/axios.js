import axios from 'axios';

// AUTH SERVICE
export const AUTH_API = axios.create({
  baseURL: 'https://india-temple.onrender.com/api/auth',
  withCredentials: true,
});

// TEMPLE SERVICE
export const TEMPLE_API = axios.create({
  baseURL: 'https://india-temple-1.onrender.com/api/temples',
  withCredentials: true,
});

const attachToken = (config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

AUTH_API.interceptors.request.use(
  attachToken,
  (error) => Promise.reject(error)
);

TEMPLE_API.interceptors.request.use(
  attachToken,
  (error) => Promise.reject(error)
);

export default TEMPLE_API;