import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import type { LoginData, RegisterData, AuthResponse, User } from './types';
import type { HttpClient, ApiError } from '@/api/types';

const BASE_URL = '/auth';

// Query keys для инвалидации кэша
export const userKeys = {
  all: ['user'] as const,
  profile: () => [...userKeys.all, 'profile'] as const,
};

export const userModule = (httpClient: HttpClient) => ({
  // Хук для получения профиля пользователя
  useUserProfile() {
    return useQuery({
      queryKey: userKeys.profile(),
      queryFn: this.getProfile,
      enabled: !!localStorage.getItem('auth_token'),
      retry: (failureCount, error: ApiError) => {
      // Не повторять запрос при 401 ошибке (unauthorized)
        if (error?.response?.status === 401) {
          return false;
        }
        return failureCount < 1;
      },
      // Не ретраить при монтировании, если есть токен
      retryOnMount: false,
    });
  },

  // Хук для логина
  useLogin() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (loginData: LoginData) => this.login(loginData),
      onSuccess: (data) => {
      // Сохраняем токен
        localStorage.setItem('auth_token', data.access_token);

        // Обновляем кэш профиля
        queryClient.setQueryData(userKeys.profile(), data.user);

        // Инвалидируем все связанные с пользователем запросы
        queryClient.invalidateQueries({ queryKey: userKeys.all });
      },
      onError: (_error: ApiError) => {
      // Очищаем данные при ошибке авторизации
        localStorage.removeItem('auth_token');
        queryClient.setQueryData(userKeys.profile(), null);
      },
    });
  },

  // Хук для регистрации
  useRegister() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (registerData: RegisterData) => this.register(registerData),
      onSuccess: (data) => {
        localStorage.setItem('auth_token', data.access_token);
        queryClient.setQueryData(userKeys.profile(), data.user);
        queryClient.invalidateQueries({ queryKey: userKeys.all });
      },
      onError: (_error: ApiError) => {
        localStorage.removeItem('auth_token');
        queryClient.setQueryData(userKeys.profile(), null);
      },
    });
  },

  // Хук для логаута
  useLogout() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (): Promise<void> => {
        localStorage.removeItem('auth_token');
      },
      onSuccess: () => {
      // Очищаем все кэшированные данные пользователя
        queryClient.setQueryData(userKeys.profile(), null);
        queryClient.removeQueries({ queryKey: userKeys.all });
      },
    });
  },

  // userApi
  async login(loginData: LoginData) {
    const response = await httpClient.post<AuthResponse>(`${BASE_URL}/login`, loginData);
    return response.data;
  },

  async register(registerData: RegisterData) {
    const response = await httpClient.post<AuthResponse>(`${BASE_URL}/register`, registerData);
    return response.data;
  },

  async getProfile() {
    const response = await httpClient.get<User>(`${BASE_URL}/profile`);
    return response.data;
  },
});

export * as UserModule from './types';
