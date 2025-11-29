import type { AxiosInstance, AxiosError } from 'axios';
import type { createApiClient } from '@/api/modules';

export type ApiError = AxiosError<{
  message?: string;
  error?: string;
}>;

export type HttpClient = AxiosInstance;
export type ApiClient = ReturnType<typeof createApiClient>;
