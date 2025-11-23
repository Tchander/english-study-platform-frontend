import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User } from '@/api/userApi';
import { userApi } from '@/api/userApi';

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!user.value);

  const login = async (email: string, password: string) => {
    try {
      isLoading.value = true;
      error.value = null;
      const response = await userApi.login({ email, password });
      localStorage.setItem('auth_token', response.access_token);
      user.value = response.user;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Ошибка авторизации';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const register = async (email: string, password: string, role: 'student' | 'teacher') => {
    try {
      isLoading.value = true;
      error.value = null;
      const response = await userApi.register({ email, password, role });
      localStorage.setItem('auth_token', response.access_token);
      user.value = response.user;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Ошибка регистрации';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchProfile = async () => {
    try {
      isLoading.value = true;
      error.value = null;
      user.value = await userApi.getProfile();
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Ошибка загрузки профиля';
      localStorage.removeItem('auth_token');
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = () => {
    user.value = null;
    localStorage.removeItem('auth_token');
  };

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    register,
    fetchProfile,
    logout,
  };
});
