import { defineStore } from 'pinia';
import { computed } from 'vue';
import { useUserProfile, useLogin, useRegister, useLogout } from '@/api/user/userQueries';

export const useUserStore = defineStore('user', () => {
  // Query hooks
  const {
    data: user,
    isLoading: isProfileLoading,
    error: profileError,
    refetch: refetchProfileQuery // Добавляем refetch функцию из useQuery
  } = useUserProfile();

  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();

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

  const login = async (email: string, password: string) => {
    return loginMutation.mutateAsync({ email, password });
  };

  const register = async (email: string, password: string, role: 'student' | 'teacher') => {
    return registerMutation.mutateAsync({ email, password, role });
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
