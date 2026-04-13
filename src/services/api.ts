import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Создаем instance axios
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Интерцептор для добавления токена
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Интерцептор для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  
  register: (data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    role?: string;
    phone?: string;
  }) => api.post('/auth/register', data),
  
  logout: () => api.post('/auth/logout'),
  
  me: () => api.get('/auth/me'),
};

// Children API
export const childrenAPI = {
  getAll: () => api.get('/children'),
  getById: (id: number) => api.get(`/children/${id}`),
  create: (data: {
    first_name: string;
    last_name: string;
    birth_date: string;
    avatar_url?: string;
    diagnosis?: string;
  }) => api.post('/children', data),
  update: (id: number, data: Partial<Parameters<typeof childrenAPI.create>[0]>) => 
    api.put(`/children/${id}`, data),
  delete: (id: number) => api.delete(`/children/${id}`),
};

// Exercises API
export const exercisesAPI = {
  getAll: (params?: {
    type?: string;
    category_id?: number;
    difficulty?: number;
    search?: string;
  }) => api.get('/exercises', { params }),
  
  getCategories: () => api.get('/exercises/categories'),
  getById: (id: number) => api.get(`/exercises/${id}`),
  
  startSession: (exerciseId: number, childId: number) => 
    api.post(`/exercises/${exerciseId}/start`, { child_id: childId }),
  
  completeSession: (
    exerciseId: number,
    data: {
      session_id: number;
      score: number;
      accuracy_percent?: number;
      details?: Record<string, unknown>;
    }
  ) => api.post(`/exercises/${exerciseId}/complete`, data),
};

// Progress API
export const progressAPI = {
  getProgress: (childId: number) => api.get(`/progress/${childId}`),
  getDetailed: (childId: number, days?: number) => 
    api.get(`/progress/${childId}/detailed`, { params: { days } }),
  getAchievements: (childId: number) => api.get(`/progress/${childId}/achievements`),
  getRecommendations: (childId: number) => api.get(`/progress/${childId}/recommendations`),
  getHistory: (childId: number) => api.get(`/progress/${childId}/history`),
};

// Chat API
export const chatAPI = {
  getConversations: () => api.get('/conversations'),
  getMessages: (userId: number, page: number = 1) => 
    api.get(`/conversations/${userId}/messages`, { params: { page } }),
  sendMessage: (userId: number, content: string, childId?: number) => 
    api.post(`/conversations/${userId}/messages`, { content, child_id: childId }),
  getUnreadCount: () => api.get('/messages/unread-count'),
};

export default api;
