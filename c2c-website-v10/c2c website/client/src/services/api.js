import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('c2c_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const eventsAPI = {
  getEvents: (params) => api.get('/events', { params }),
  getEventById: (id) => api.get(`/events/${id}`),
  createEvent: (data) => api.post('/events', data),
  updateEvent: (id, data) => api.put(`/events/${id}`, data),
  deleteEvent: (id) => api.delete(`/events/${id}`),
  registerForEvent: (id) => api.post(`/events/${id}/register`),
  cancelRegistration: (id) => api.post(`/events/${id}/cancel`),
  getMyRegisteredEvents: () => api.get('/events/my/registered'),
};

export const projectsAPI = {
  getProjects: (params) => api.get('/projects', { params }),
  getProjectById: (id) => api.get(`/projects/${id}`),
  createProject: (data) => api.post('/projects', data),
  likeProject: (id) => api.post(`/projects/${id}/like`),
  deleteProject: (id) => api.delete(`/projects/${id}`),
};

export const teamAPI = {
  getTeamMembers: () => api.get('/team'),
  createTeamMember: (data) => api.post('/team', data),
  deleteTeamMember: (id) => api.delete(`/team/${id}`),
};

export const announcementAPI = {
  getAnnouncements: () => api.get('/announcements'),
  createAnnouncement: (data) => api.post('/announcements', data),
  deleteAnnouncement: (id) => api.delete(`/announcements/${id}`),
};

export const contactAPI = {
  submitContact: (data) => api.post('/contact', data),
  getContacts: () => api.get('/contact'),
  deleteContact: (id) => api.delete(`/contact/${id}`),
};

export const joinAPI = {
  submitApplication: (data) => api.post('/join', data),
  getApplications: () => api.get('/join'),
  updateStatus: (id, status) => api.put(`/join/${id}/status`, { status }),
};

export const statsAPI = {
  getStats: () => api.get('/stats'),
  getDomains: () => api.get('/stats/domains'),
};

export const adminAPI = {
  updateApplicationStatus: (id, status) => api.put(`/join/${id}/status`, { status }),
};

export const contentAPI = {
  getContent: () => api.get('/content'),
};

export default api;
