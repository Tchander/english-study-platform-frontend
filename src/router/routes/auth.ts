import { RouteName } from '../enums';
import type { RouteRecordRaw } from 'vue-router';

const authRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: RouteName.LOGIN,
    component: () => import('@/views/LoginView.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/register',
    name: RouteName.REGISTER,
    component: () => import('@/views/RegisterView.vue'),
    meta: { requiresAuth: false },
  },
];

export default authRoutes;
