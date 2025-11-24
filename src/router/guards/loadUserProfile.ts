// src/router/guards/loadUserProfile.ts
import { useUserStore } from '@/stores/user';
import { RouteName } from '../enums';
import type { NavigationGuard } from 'vue-router';

/**
 * Проверяет, является ли маршрут auth маршрутом (login/register)
 */
const isAuthRoute = (routeName: string | undefined | symbol): boolean => {
  return routeName === RouteName.LOGIN || routeName === RouteName.REGISTER;
};

/**
 * Navigation guard для загрузки профиля пользователя и проверки аутентификации
 * - Для защищенных маршрутов (requiresAuth): проверяет токен и загружает профиль
 * - Для auth маршрутов (login/register): редиректит на главную если пользователь авторизован
 */
export const loadUserProfile: NavigationGuard = async (to, from, next) => {
  const userStore = useUserStore();
  const token = localStorage.getItem('auth_token');

  // Если маршрут требует авторизации
  if (to.meta.requiresAuth) {
    if (token) {
      // Если пользователь не загружен, но есть токен
      if (!userStore.user) {
        try {
          await userStore.refetchProfile();
          next();
        } catch (_error) {
          localStorage.removeItem('auth_token');
          next('/login');
        }
      } else {
        next();
      }
    } else {
      next('/login');
    }
  } else {
    // Если пользователь авторизован, но пытается попасть на login/register
    if (isAuthRoute(to.name)) {
      if (token) {
        if (!userStore.user) {
          try {
            await userStore.refetchProfile();
            next('/');
          } catch (_error) {
            localStorage.removeItem('auth_token');
            next();
          }
        } else {
          next('/');
        }
      } else {
        next();
      }
    } else {
      next();
    }
  }
};
