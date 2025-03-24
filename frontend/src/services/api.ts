import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем интерсептор для добавления токена к запросам
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

// Типы данных
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'OWNER' | 'SITTER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

export interface Sitter {
  id: number;
  name: string;
  photo: string;
  rating: number;
  reviews: number;
  distance: string;
  price: number;
  isFavorite: boolean;
  availableDates: Array<{
    start: string;
    end: string;
  }>;
}

export interface SearchParams {
  location: string;
  startDate: string;
  endDate: string;
  petType: 'DOG' | 'CAT';
}

// API методы
export const auth = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (name: string, email: string, password: string, role: 'OWNER' | 'SITTER') => {
    const response = await api.post('/auth/register', { name, email, password, role });
    return response.data;
  },
  
  me: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export const sitters = {
  search: async (params: SearchParams) => {
    const response = await api.get('/sitters', { params });
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/sitters/${id}`);
    return response.data;
  },
  
  toggleFavorite: async (id: number) => {
    const response = await api.post(`/sitters/${id}/favorite`);
    return response.data;
  },
};

export const requests = {
  create: async (data: {
    startDate: string;
    endDate: string;
    petType: 'DOG' | 'CAT';
    description: string;
    location: string;
  }) => {
    const response = await api.post('/requests', data);
    return response.data;
  },
  
  getMyRequests: async () => {
    const response = await api.get('/requests/my');
    return response.data;
  },
  
  getAvailableRequests: async () => {
    const response = await api.get('/requests/available');
    return response.data;
  },
};

export default api; 