import { object, string } from 'yup';
import { UserRole } from '@/enums/userRoles';

enum ERRORS {
  EMAIL_REQUIRED = 'Email обязателен',
  EMAIL_INVALID = 'Некорректный формат email',
  PASSWORD_REQUIRED = 'Пароль обязателен',
  PASSWORD_SHORT = 'Пароль должен быть не менее 6 символов',
  ROLE_REQUIRED = 'Роль обязательна',
  ROLE_INVALID = 'Некорректная роль',
}

export const loginSchema = object({
  email: string()
    .email(ERRORS.EMAIL_INVALID)
    .required(ERRORS.EMAIL_REQUIRED)
    .trim(),

  password: string()
    .min(6, ERRORS.PASSWORD_SHORT)
    .required(ERRORS.PASSWORD_REQUIRED)
    .trim()
});

export const registerSchema = loginSchema.shape({
  role: string()
    .oneOf([UserRole.STUDENT, UserRole.TEACHER], ERRORS.ROLE_INVALID)
    .required(ERRORS.ROLE_REQUIRED)
});
