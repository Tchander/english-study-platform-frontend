import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

export interface User {
  id: number;
  email: string;
  role: 'student' | 'teacher';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData extends LoginData {
  role: 'student' | 'teacher';
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

// Создаем экземпляр axios с базовыми настройками
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для добавления токена к запросам
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Интерцептор для обработки ошибок авторизации
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const userApi = {
  async login(loginData: LoginData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', loginData);
    return response.data;
  },

  async register(registerData: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', registerData);
    return response.data;
  },

  async getProfile(): Promise<User> {
    const response = await api.get<User>('/auth/profile');
    return response.data;
  },
};
