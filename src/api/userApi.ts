import axios from 'axios';

const API_BASE_DOMAIN = 'http://localhost:3000';

const BASE_URL = '/auth';

export type User = {
  id: number;
  email: string;
  role: 'student' | 'teacher';
};

export type LoginData = {
  email: string;
  password: string;
};

export type RegisterData = LoginData & {
  role: 'student' | 'teacher';
};

export type AuthResponse = {
  access_token: string;
  user: User;
};

// Создаем экземпляр axios с базовыми настройками
const api = axios.create({
  baseURL: API_BASE_DOMAIN,
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
    const response = await api.post<AuthResponse>(`${BASE_URL}/login`, loginData);
    return response.data;
  },

  async register(registerData: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(`${BASE_URL}/register`, registerData);
    return response.data;
  },

  async getProfile(): Promise<User> {
    const response = await api.get<User>(`${BASE_URL}/profile`);
    return response.data;
  },
};
