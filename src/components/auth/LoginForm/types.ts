import type { AuthResponse } from '@/api/modules/user/types';

export type LoginFormEmits = {
  success: [response: AuthResponse];
  'go-to-register': [];
};
