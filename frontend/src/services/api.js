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
    const requestUrl = error.config?.url || '';
    const isAuthRoute = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/register');

    if (error.response?.status === 401 && !isAuthRoute) {
      // Unauthorized (not during login/register) - clear token and redirect to login
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
  delete: (id) => api.delete(`/api/course/${id}`),
  regenerateDay: (courseId, day) => api.post(`/api/course/${courseId}/regenerate-day`, { day }),

  // Sharing methods
  shareCourse: (courseId, isPublic) => api.post(`/api/course/${courseId}/share`, { isPublic }),
  getSharingStatus: (courseId) => api.get(`/api/course/${courseId}/sharing`),
  getSharedCourse: (token) => api.get(`/api/course/shared/${token}`),

  /**
   * Generate course with SSE progress updates
   * @param {object} data - Course generation params (topic, level, days, timePerDay)
   * @param {function} onProgress - Callback for progress events
   * @returns {Promise} Resolves with course data on complete
   */
  generateWithProgress: (data, onProgress) => {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('token');

      // Use fetch with POST for SSE (EventSource only supports GET)
      fetch(`${API_URL}/api/course/generate-stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let buffer = '';

          const processStream = ({ done, value }) => {
            if (done) {
              return;
            }

            buffer += decoder.decode(value, { stream: true });

            // Process complete SSE messages
            const lines = buffer.split('\n');
            buffer = lines.pop() || ''; // Keep incomplete line in buffer

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const eventData = JSON.parse(line.slice(6));
                  onProgress(eventData);

                  if (eventData.type === 'complete') {
                    resolve(eventData.course);
                  } else if (eventData.type === 'error') {
                    reject(new Error(eventData.message));
                  }
                } catch (e) {
                  console.error('Failed to parse SSE event:', e);
                }
              }
            }

            return reader.read().then(processStream);
          };

          return reader.read().then(processStream);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
};

// Activity API
export const activityAPI = {
  log: () => api.post('/api/activity/log'),
  getAll: () => api.get('/api/activity'),
};

// Notes API
export const notesAPI = {
  // Get note for a specific lesson
  getNote: (courseId, day, lessonId) => api.get(`/api/notes/${courseId}/${day}/${lessonId}`),

  // Create or update note for a lesson (upsert)
  saveNote: (courseId, day, lessonId, content) => api.put(`/api/notes/${courseId}/${day}/${lessonId}`, { content }),

  // Get all notes for a course
  getCourseNotes: (courseId) => api.get(`/api/notes/${courseId}`),

  // Delete note
  deleteNote: (courseId, day, lessonId) => api.delete(`/api/notes/${courseId}/${day}/${lessonId}`),
};

export default api;

