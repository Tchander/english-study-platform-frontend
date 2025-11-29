import axios from 'axios';
import { HttpCodes } from '@/api/enums';
import type { HttpClient, ApiClient } from '@/api/types';

let isRedirecting = false;

export const registerRedirectInterceptor = (httpClient: HttpClient, _apiClient: ApiClient) => {
  httpClient.interceptors.response.use(
    undefined,
    async (error) => {
      if (!axios.isAxiosError(error)) {
        // ...

        throw error;
      }

      console.error('redirect interceptor', error);

      const status = error.response?.status;
      const url = error.config?.url;

      if (status == null) throw error;

      // Пропускаем запросы на аутентификацию
      if (url?.includes('/auth/login') || url?.includes('/auth/register')) {
        throw error;
      }

      if (status >= HttpCodes.INTERNAL_SERVER_ERROR) {
        // ...

        throw error;
      }

      if (status === HttpCodes.FORBIDDEN) {
        // ...

        throw error;
      }

      if (status === HttpCodes.UNAUTHORIZED) {
        // Защита от бесконечного редиректа
        if (!isRedirecting && !window.location.pathname.includes('/login')) {
          isRedirecting = true;

          // Очищаем токен
          localStorage.removeItem('auth_token');

          // Редирект только если мы не уже на странице логина
          window.location.href = '/login';
        }
        return;
      }

      throw error;
    },
  );
};
