import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { userApi, type LoginData, type RegisterData } from './userApi';

// Query keys для инвалидации кэша
export const userKeys = {
  all: ['user'] as const,
  profile: () => [...userKeys.all, 'profile'] as const,
};

// Хук для получения профиля пользователя
export const useUserProfile = () => {
  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: userApi.getProfile,
    enabled: !!localStorage.getItem('auth_token'),
    retry: (failureCount, error: any) => {
      // Не повторять запрос при 401 ошибке (unauthorized)
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 1;
    },
    // Важно: не ретраить при монтировании, если есть токен
    retryOnMount: false,
  });
};

// Хук для логина
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (loginData: LoginData) => userApi.login(loginData),
    onSuccess: (data) => {
      // Сохраняем токен
      localStorage.setItem('auth_token', data.access_token);

      // Обновляем кэш профиля
      queryClient.setQueryData(userKeys.profile(), data.user);

      // Инвалидируем все связанные с пользователем запросы
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
    onError: (error: any) => {
      // Очищаем данные при ошибке авторизации
      localStorage.removeItem('auth_token');
      queryClient.setQueryData(userKeys.profile(), null);
    },
  });
};

// Хук для регистрации
export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (registerData: RegisterData) => userApi.register(registerData),
    onSuccess: (data) => {
      localStorage.setItem('auth_token', data.access_token);
      queryClient.setQueryData(userKeys.profile(), data.user);
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
    onError: (error: any) => {
      localStorage.removeItem('auth_token');
      queryClient.setQueryData(userKeys.profile(), null);
    },
  });
};

// Хук для логаута
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      localStorage.removeItem('auth_token');
    },
    onSuccess: () => {
      // Очищаем все кэшированные данные пользователя
      queryClient.setQueryData(userKeys.profile(), null);
      queryClient.removeQueries({ queryKey: userKeys.all });
    },
  });
};
