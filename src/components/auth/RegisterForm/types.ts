import type { AuthResponse } from '@/api/modules/user/types';

export type RegisterFormEmits = {
  success: [response: AuthResponse];
  'go-to-login': [];
};
