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
