import { object, string } from 'yup';

export const loginSchema = object({
  email: string()
    .required('Email обязателен')
    .email('Некорректный формат email')
    .trim(),

  password: string()
    .required('Пароль обязателен')
    .min(6, 'Пароль должен быть не менее 6 символов')
    .trim()
});

export const registerSchema = loginSchema.shape({
  role: string()
    .required('Роль обязательна')
    .oneOf(['student', 'teacher'], 'Некорректная роль')
});
