import { RouteName } from '@/router/enums';
import authRoutes from './auth';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: RouteName.HOME,
    component: () => import('@/views/HomeView.vue'),
    meta: { requiresAuth: true },
  },
  ...authRoutes,
];

export default routes;
