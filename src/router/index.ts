import { createRouter, createWebHistory } from 'vue-router';
import { loadUserProfile } from './guards';
import routes from './routes';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(loadUserProfile);

export default router;
