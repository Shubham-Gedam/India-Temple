import axios from 'axios';

// AUTH SERVICE
export const AUTH_API = axios.create({
  baseURL:
    import.meta.env.MODE === "production"
      ? "https://india-temple.onrender.com/api/auth"
      : "http://localhost:3000/api/auth",
  withCredentials: true,
});

// TEMPLE SERVICE
export const TEMPLE_API = axios.create({
  baseURL:
    import.meta.env.MODE === "production"
      ? "https://india-temple-1.onrender.com/api/temples"
      : "http://localhost:3001/api/temples",
  withCredentials: true,
});

export default TEMPLE_API;