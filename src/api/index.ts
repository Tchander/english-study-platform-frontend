import axios from 'axios';
import { createApiClient } from '@/api/modules';
import { registerInterceptors } from '@/api/interceptors';

const API_BASE_DOMAIN = 'http://localhost:3000';

export const httpClient = axios.create({
  baseURL: API_BASE_DOMAIN,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }
});

const apiClient = createApiClient(httpClient);

registerInterceptors(httpClient, apiClient);

export const useApi = () => apiClient;

export * from './types';
export * from './enums';
