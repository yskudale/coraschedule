// ============================================
// api/client.ts
// The single Axios instance for the entire app.
// Every API call goes through this — never create
// a separate axios instance anywhere else.
//
// Three things configured here:
// 1. Base URL      → from environment variable
// 2. Request interceptor  → attaches auth token
// 3. Response interceptor → handles errors centrally
// ============================================

import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { STORAGE_KEYS } from '@/constants';

// ─── Create the Axios instance ────────────────────────────────────────────────
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api',
  timeout: 10000, // 10 seconds — request fails if no response by then
  headers: {
    'Content-Type': 'application/json',
    'Accept':       'application/json',
  },
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
// Runs before EVERY request is sent.
// Reads token from localStorage and attaches to header.
// Without this every thunk would manually add the token.
client.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// ─── Response Interceptor ─────────────────────────────────────────────────────
// Runs after EVERY response comes back.
// Handles common error cases in one place.
client.interceptors.response.use(
  // Success — just return the response as is
  (response) => response,

  // Error — handle centrally based on status code
  (error: AxiosError) => {
    const status = error.response?.status;

    if (status === 401) {
      // Unauthorized — token expired or invalid
      // Clear localStorage and redirect to login
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      window.location.href = '/login';
    }

    if (status === 403) {
      // Forbidden — user does not have permission
      console.warn('Access denied — insufficient permissions.');
    }

    if (status === 404) {
      // Not found — resource does not exist
      console.warn('Resource not found:', error.config?.url);
    }

    if (status !== undefined && status >= 500) {
      // Server error — backend crashed
      console.error('Server error — please try again later.');
    }

    // Always reject so thunks can catch in rejectWithValue
    return Promise.reject(error);
  }
);

export default client;