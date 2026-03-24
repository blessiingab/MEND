import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  signup: (data) => API.post('/auth/signup', data),
  signin: (data) => API.post('/auth/signin', data),
  getCurrentUser: () => API.get('/auth/me'),
};

// Assessment endpoints
export const assessmentAPI = {
  create: (data) => API.post('/assessments', data),
  getUserAssessments: () => API.get('/assessments/user'),
  getLatest: () => API.get('/assessments/latest'),
};

// User endpoints
export const userAPI = {
  getUser: (id) => API.get(`/users/${id}`),
  getAllUsers: () => API.get('/users'),
};

// Therapist endpoints
export const therapistAPI = {
  getAll: () => API.get('/therapists'),
};

// Mentor endpoints
export const mentorAPI = {
  getAll: () => API.get('/mentors'),
};

export default API;