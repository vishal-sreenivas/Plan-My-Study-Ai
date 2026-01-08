// API service layer
// Centralized axios instance with authentication and error handling

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
};

// Course API
export const courseAPI = {
  generate: (data) => api.post('/api/course/generate', data),
  getAll: () => api.get('/api/course'),
  getById: (id) => api.get(`/api/course/${id}`),
  updateProgress: (data) => api.put('/api/course/progress', data),
};

// Activity API
export const activityAPI = {
  log: () => api.post('/api/activity/log'),
  getAll: () => api.get('/api/activity'),
};

export default api;

