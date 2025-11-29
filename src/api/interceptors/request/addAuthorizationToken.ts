import type { HttpClient } from '@/api/types';

export const registerAddAuthorizationTokenInterceptor = (httpClient: HttpClient) => {
  httpClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
};
