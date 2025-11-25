import { defineStore } from 'pinia';
import { computed } from 'vue';
import { useApi } from '@/api';
import type { LoginData, RegisterData } from './types';

const api = useApi();

export const useUserStore = defineStore('user', () => {
  // Query hooks
  const {
    data: user,
    isLoading: isProfileLoading,
    error: profileError,
    refetch: refetchProfileQuery // Добавляем refetch функцию из useQuery
  } = api.user.useUserProfile();

  const loginMutation = api.user.useLogin();
  const registerMutation = api.user.useRegister();
  const logoutMutation = api.user.useLogout();

  // Computed свойства
  const isAuthenticated = computed(() => !!user.value);

  // Объединенные состояния loading
  const isLoading = computed(() =>
    isProfileLoading.value ||
    loginMutation.isPending.value ||
    registerMutation.isPending.value
  );

  // Объединенные ошибки
  const error = computed(() =>
    profileError.value?.message ||
    loginMutation.error.value?.message ||
    registerMutation.error.value?.message ||
    null
  );

  const login = async (payload: LoginData) => {
    return loginMutation.mutateAsync(payload);
  };

  const register = async (payload: RegisterData) => {
    return registerMutation.mutateAsync(payload);
  };

  const logout = () => {
    logoutMutation.mutate();
  };

  // Исправленный метод для принудительного обновления профиля
  const refetchProfile = async () => {
    const result = await refetchProfileQuery();
    return result.data;
  };

  return {
    // Data
    user,
    // States
    isLoading,
    error,
    // Computed
    isAuthenticated,
    // Actions
    login,
    register,
    logout,
    refetchProfile,
  };
});
