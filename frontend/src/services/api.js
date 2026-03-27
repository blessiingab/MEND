/**
 * API Client Service
 */
import axios from 'axios';
import { getToken, removeToken } from '../utils/auth';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add token
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => {
    // Return the data property from the response, or the whole response if no data property
    return response.data?.data !== undefined ? response.data.data : response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

// Auth Service
export const authService = {
  register: (email, password, firstName, lastName, role = 'user', metadata = {}) =>
    apiClient.post('/auth/register', { email, password, firstName, lastName, role, ...metadata }),
  login: (email, password, role = 'user') =>
    apiClient.post('/auth/login', { email, password, role }),
  getProfile: () =>
    apiClient.get('/auth/profile'),
  updateProfile: (userData) =>
    apiClient.put('/auth/profile', userData),
  changePassword: (oldPassword, newPassword) =>
    apiClient.post('/auth/change-password', { oldPassword, newPassword })
};

// Assessment Service
export const assessmentService = {
  submitPHQ9: (answers) =>
    apiClient.post('/assessments/phq9', { answers }),
  submitGAD7: (answers) =>
    apiClient.post('/assessments/gad7', { answers }),
  getHistory: () =>
    apiClient.get('/assessments/history'),
  getStats: () =>
    apiClient.get('/assessments/stats'),
  getLatest: (type) =>
    apiClient.get(`/assessments/latest/${type}`)
};

// Therapy Session Service
export const sessionService = {
  bookSession: (therapistId, startTime, endTime, notes) =>
    apiClient.post('/sessions/book', { therapistId, startTime, endTime, notes }),
  getMySessions: (limit, offset) =>
    apiClient.get('/sessions/my-sessions', { params: { limit, offset } }),
  getTherapistSessions: (limit, offset) =>
    apiClient.get('/sessions/therapist-sessions', { params: { limit, offset } }),
  getAvailableTherapists: () =>
    apiClient.get('/sessions/available-therapists'),
  getSessionById: (sessionId) =>
    apiClient.get(`/sessions/${sessionId}`),
  updateSession: (sessionId, data) =>
    apiClient.put(`/sessions/${sessionId}`, data),
  cancelSession: (sessionId) =>
    apiClient.put(`/sessions/${sessionId}/cancel`),
  createTherapistGroup: (name, description, careFocus) =>
    apiClient.post('/sessions/groups', { name, description, careFocus }),
  getTherapistGroups: () =>
    apiClient.get('/sessions/groups'),
  addMemberToTherapistGroup: (groupId, userId) =>
    apiClient.post(`/sessions/groups/${groupId}/members`, { userId }),
  removeMemberFromTherapistGroup: (groupId, userId) =>
    apiClient.delete(`/sessions/groups/${groupId}/members/${userId}`),
  getTherapistClients: () =>
    apiClient.get('/sessions/therapist-clients')
};

// Post Service
export const postService = {
  createPost: (title, content, type, thumbnail) =>
    apiClient.post('/posts', { title, content, type, thumbnail }),
  getAllPosts: (type, limit, offset) => {
    const params = { limit, offset };
    if (type && type !== 'all') params.type = type;
    return apiClient.get('/posts', { params });
  },
  getPostById: (postId) =>
    apiClient.get(`/posts/${postId}`),
  getUserPosts: (userId, limit, offset) =>
    apiClient.get(`/posts/user/${userId}`, { params: { limit, offset } }),
  updatePost: (postId, data) =>
    apiClient.put(`/posts/${postId}`, data),
  deletePost: (postId) =>
    apiClient.delete(`/posts/${postId}`),
  likePost: (postId) =>
    apiClient.post(`/posts/${postId}/like`),
  unlikePost: (postId) =>
    apiClient.delete(`/posts/${postId}/like`),
  getPostStats: (postId) =>
    apiClient.get(`/posts/${postId}/stats`),
  createComment: (postId, content) =>
    apiClient.post(`/posts/${postId}/comments`, { content }),
  getPostComments: (postId, limit, offset) =>
    apiClient.get(`/posts/${postId}/comments`, { params: { limit, offset } })
};

// Comment Service
export const commentService = {
  createComment: (postId, content) =>
    apiClient.post(`/posts/${postId}/comments`, { content }),
  getPostComments: (postId, limit, offset) =>
    apiClient.get(`/posts/${postId}/comments`, { params: { limit, offset } }),
  updateComment: (commentId, content) =>
    apiClient.put(`/posts/comments/${commentId}`, { content }),
  deleteComment: (commentId) =>
    apiClient.delete(`/posts/comments/${commentId}`)
};

// Career Service
export const careerService = {
  createGuidanceSession: (careerGoal, currentRole, experience, guidance, recommendedActions) =>
    apiClient.post('/career/guidance', { 
      careerGoal, currentRole, experience, guidance, recommendedActions 
    }),
  getMyPath: () =>
    apiClient.get('/career/my-path'),
  getHistory: (limit, offset) =>
    apiClient.get('/career/history', { params: { limit, offset } }),
  getResources: (type, limit, offset) =>
    apiClient.get('/career/resources', { params: { type, limit, offset } }),
  trackProgress: (goal, milestone) =>
    apiClient.post('/career/progress', { goal, milestone }),
  getProgressTracking: () =>
    apiClient.get('/career/progress/tracking')
};

// Admin Service
export const adminService = {
  getDashboardStats: () =>
    apiClient.get('/admin/dashboard/stats'),
  getAllUsers: (limit, offset) =>
    apiClient.get('/admin/users', { params: { limit, offset } }),
  getUserDetails: (userId) =>
    apiClient.get(`/admin/users/${userId}`),
  deleteUser: (userId) =>
    apiClient.delete(`/admin/users/${userId}`),
  getAssessmentStats: () =>
    apiClient.get('/admin/assessments/stats'),
  getSessionStats: () =>
    apiClient.get('/admin/sessions/stats'),
  getPostStats: () =>
    apiClient.get('/admin/posts/stats'),
  moderateContent: (postId, action) =>
    apiClient.post('/admin/moderate-content', { postId, action }),
  getEngagementMetrics: () =>
    apiClient.get('/admin/engagement/metrics')
};

export default apiClient;
