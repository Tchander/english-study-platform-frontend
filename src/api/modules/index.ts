import { userModule } from './user';
import type { HttpClient } from '@/api/types';

export const createApiClient = (httpClient: HttpClient) => ({
  user: userModule(httpClient),
});
