import { registerAddAuthorizationTokenInterceptor } from './request';
import { registerRedirectInterceptor } from './response';
import type { HttpClient, ApiClient } from '@/api/types';

export const registerInterceptors = (httpClient: HttpClient, apiClient: ApiClient) => {
  registerRedirectInterceptor(httpClient, apiClient);
  registerAddAuthorizationTokenInterceptor(httpClient);
};
