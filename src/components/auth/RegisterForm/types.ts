import { UserRole } from '@/enums/userRoles';

export type RegisterFormEmits = {
  success: [];
  'go-to-login': [];
};

// TODO поменять на переменную из стора
export type RegisterFormData = {
  email: string;
  password: string;
  role: UserRole.TEACHER | UserRole.STUDENT;
};
