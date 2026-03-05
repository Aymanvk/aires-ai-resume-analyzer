/**
 * src/api/axios.js
 *
 * Centralized Axios instance for the AIRES frontend.
 * All API calls go through this instance so the base URL never
 * needs to be repeated per-component.
 *
 * Change VITE_API_BASE_URL in .env to switch between dev / staging / prod.
 */
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: false, // set true if you switch to cookie-based auth later
});

// ── Request interceptor: attach JWT if present ────────────────────────────────
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ── Response interceptor: unwrap errors into a readable string ────────────────
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Normalise network errors and API error payloads into a single message
        const message =
            error.response?.data?.message ||
            error.response?.data?.errors?.[0]?.msg ||
            error.message ||
            'An unexpected error occurred.';
        return Promise.reject(new Error(message));
    }
);

export default api;
