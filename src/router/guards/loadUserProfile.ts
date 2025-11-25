import { useUserStore } from '@/stores/user';
import { RouteName } from '../enums';
import type { NavigationGuard, RouteRecordNameGeneric } from 'vue-router';

/**
 * Проверяет, является ли маршрут auth маршрутом (login/register)
 */
const isAuthRoute = (routeName: RouteRecordNameGeneric): boolean => {
  return routeName === RouteName.LOGIN || routeName === RouteName.REGISTER;
};

/**
 * Navigation guard для загрузки профиля пользователя и проверки аутентификации
 */
export const loadUserProfile: NavigationGuard = async (to, from, next) => {
  const userStore = useUserStore();
  const token = localStorage.getItem('auth_token');

  // Если это auth маршрут и есть токен - редирект на главную
  if (isAuthRoute(to.name) && token) {
    // Если пользователь уже загружен - сразу редирект
    if (userStore.user) {
      next('/');
      return;
    }

    // Если пользователь не загружен, но есть токен - пробуем загрузить
    try {
      await userStore.refetchProfile();
      next('/');
    } catch (_error) {
      // Если не удалось загрузить профиль - очищаем токен и разрешаем доступ к auth страницам
      localStorage.removeItem('auth_token');
      next();
    }
    return;
  }

  // Если маршрут требует авторизации
  if (to.meta.requiresAuth) {
    if (!token) {
      next('/login');
      return;
    }

    // Если пользователь уже загружен - разрешаем доступ
    if (userStore.user) {
      next();
      return;
    }

    // Пытаемся загрузить профиль
    try {
      await userStore.refetchProfile();
      next();
    } catch (_error) {
      // Если произошла ошибка - очищаем токен и редиректим на логин
      localStorage.removeItem('auth_token');
      next('/login');
    }
    return;
  }

  // Для публичных маршрутов
  next();
};
