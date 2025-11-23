import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores/user';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { requiresAuth: false },
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();

  // Если маршрут требует авторизации
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('auth_token');

    if (token) {
      // Если пользователь не загружен, но есть токен
      if (!userStore.user) {
        try {
          await userStore.fetchProfile();
          next();
        } catch (error) {
          // Если токен невалидный
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
    if (to.name === 'login' || to.name === 'register') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        if (!userStore.user) {
          try {
            await userStore.fetchProfile();
            next('/');
          } catch (error) {
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
});

export default router;
