// api.ts
import axios from 'axios';

const API_BASE_URL = 'http://your-backend-api-base-url';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// User APIs
export const userApi = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  register: (userData: any) => api.post('/auth/register', userData),
  getProfile: () => api.get('/users/me'),
};

// Team APIs
export const teamApi = {
  createTeam: (teamData: { name: string; competitionId: string }) =>
    api.post('/teams', teamData),
  joinTeam: (teamId: string) => api.post(`/teams/${teamId}/join`),
  getTeam: (teamId: string) => api.get(`/teams/${teamId}`),
};

// Competition APIs
export const competitionApi = {
  createCompetition: (competitionData: any) =>
    api.post('/competitions', competitionData),
  getCompetition: (competitionId: string) =>
    api.get(`/competitions/${competitionId}`),
  startCompetition: (competitionId: string) =>
    api.post(`/competitions/${competitionId}/start`),
  getLiveCompetitions: () => api.get('/competitions/live'),
};

// Problem APIs
export const problemApi = {
  getProblems: (competitionId: string) =>
    api.get(`/competitions/${competitionId}/problems`),
  submitSolution: (data: {
    competitionId: string;
    problemId: string;
    code: string;
    language: string;
  }) => api.post(`/competitions/${data.competitionId}/submit`, data),
};

export default api;