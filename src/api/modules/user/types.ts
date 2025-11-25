import { UserRole } from '@/enums/userRoles';

export type UserRoleType = UserRole.STUDENT | UserRole.TEACHER;

export type User = {
  id: number;
  email: string;
  role: UserRoleType;
};

export type LoginData = {
  email: string;
  password: string;
};

export type RegisterData = LoginData & {
  role: UserRoleType;
};

export type AuthResponse = {
  access_token: string;
  user: User;
};
