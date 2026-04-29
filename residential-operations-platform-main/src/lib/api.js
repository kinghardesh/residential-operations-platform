/**
 * Axios client for the Flask backend.
 *
 * baseURL is `/api` so requests go through the Vite dev proxy in development
 * (and any reverse proxy in production). Imported by every page and by
 * AuthContext for /api/auth/login.
 */
import axios from 'axios';

/**
 * Axios instance for future backend integration.
 * All data is currently served from local mock modules.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (r) => r,
  (err) => Promise.reject(err)
);

export default api;
