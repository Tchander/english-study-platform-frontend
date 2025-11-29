import { describe, it, expect, beforeEach } from 'vitest';
import { type Ref, ref } from 'vue';
import * as yup from 'yup';
import { UserRole } from '@/enums/userRoles';
import { useValidation } from './useValidation';

enum ERRORS {
  EMAIL_REQUIRED = 'Email обязателен',
  EMAIL_INVALID = 'Некорректный формат email',
  PASSWORD_REQUIRED = 'Пароль обязателен',
  PASSWORD_SHORT = 'Пароль должен быть не менее 6 символов',
  ROLE_REQUIRED = 'Роль обязательна',
  ROLE_INVALID = 'Некорректная роль',
  AGE_YOUNG = 'Нужно быть старше 18 лет',
  NAME_REQUIRED = 'Имя обязательно'
}

// Тестовая схема валидации
const testSchema = yup.object({
  email: yup.string()
    .email(ERRORS.EMAIL_INVALID)
    .required(ERRORS.EMAIL_REQUIRED)
    .trim(),

  password: yup.string()
    .min(6, ERRORS.PASSWORD_SHORT)
    .required(ERRORS.PASSWORD_REQUIRED)
    .trim(),

  role: yup.string()
    .required(ERRORS.ROLE_REQUIRED)
    .test('password-length', ERRORS.ROLE_INVALID, function(value) {
    // Если поле пустое, required уже покажет ошибку
      if (!value) return true;
      return [UserRole.STUDENT, UserRole.TEACHER].includes(value as UserRole);
    }),

  age: yup.number()
    .min(18, ERRORS.AGE_YOUNG)
    .optional(),
});

type TestForm = yup.InferType<typeof testSchema>;

describe('useValidation', () => {
  let formData: Ref<TestForm>;

  beforeEach(() => {
    formData = ref({
      email: '',
      password: '',
      role: UserRole.STUDENT,
      age: undefined,
    });
  });

  describe('validate', () => {
    it('should return true for valid data', async () => {
      formData.value.email = 'valid@example.com';
      formData.value.password = 'password123';
      formData.value.role = 'student' as UserRole;
      formData.value.age = 25;

      const { validate, errors, isValid } = useValidation(testSchema, formData.value);

      const result = await validate();

      expect(result).toBe(true);
      expect(errors.value).toEqual({});
      expect(isValid.value).toBe(true);
    });

    it('should set errors for invalid data', async () => {
      formData.value.email = 'invalid-email';
      formData.value.password = 'short';
      formData.value.role = 'invalid-role' as UserRole;
      formData.value.age = 14;

      const { validate, errors, isValid } = useValidation(testSchema, formData.value);

      const result = await validate();

      expect(result).toBe(false);
      expect(errors.value.email).toBe(ERRORS.EMAIL_INVALID);
      expect(errors.value.password).toBe(ERRORS.PASSWORD_SHORT);
      expect(errors.value.role).toBe(ERRORS.ROLE_INVALID);
      expect(errors.value.age).toBe(ERRORS.AGE_YOUNG);
      expect(isValid.value).toBe(false);
    });

    it('should set errors for empty required data', async () => {
      formData.value.role = '' as UserRole;

      const { validate, errors } = useValidation(testSchema, formData.value);

      const result = await validate();

      expect(result).toBe(false);
      expect(errors.value.email).toBe(ERRORS.EMAIL_REQUIRED);
      expect(errors.value.password).toBe(ERRORS.PASSWORD_REQUIRED);
      expect(errors.value.role).toBe(ERRORS.ROLE_REQUIRED);
    });
  });

  describe('validateField', () => {
    it('should validate single field correctly', async () => {
      const { validateField, errors } = useValidation(testSchema, formData.value);

      // Невалидный email
      formData.value.email = 'invalid-email';
      await validateField('email');

      expect(errors.value.email).toBe(ERRORS.EMAIL_INVALID);
      expect(errors.value.password).toBeUndefined();
      expect(errors.value.role).toBeUndefined();
      expect(errors.value.age).toBeUndefined();

      // Валидный email
      formData.value.email = 'valid@example.com';
      await validateField('email');

      expect(errors.value.email).toBeUndefined();
    });

    it('should clear field error when validation passes', async () => {
      formData.value.email = 'invalid-email';

      const { validateField, errors } = useValidation(testSchema, formData.value);

      await validateField('email');
      expect(errors.value.email).toBe(ERRORS.EMAIL_INVALID);

      formData.value.email = 'valid@example.com';
      await validateField('email');

      expect(errors.value.email).toBeUndefined();
    });

    it('should handle optional fields correctly', async () => {
      formData.value.email = 'test@example.com';
      formData.value.password = 'password123';
      formData.value.role = UserRole.TEACHER;
      formData.value.age = 15; // Невалидный возраст

      const { validateField, errors } = useValidation(testSchema, formData.value);

      await validateField('age');
      expect(errors.value.age).toBe(ERRORS.AGE_YOUNG);

      formData.value.age = 20;
      await validateField('age');
      expect(errors.value.age).toBeUndefined();
    });
  });

  describe('state management', () => {
    it('should track dirty state', async () => {
      const { validate, isDirty } = useValidation(testSchema, formData.value);

      expect(isDirty.value).toBe(false);

      await validate();
      expect(isDirty.value).toBe(true);
    });

    it('should track dirty state for validateField', async () => {
      const { validateField, isDirty } = useValidation(testSchema, formData.value);

      expect(isDirty.value).toBe(false);

      await validateField('email');
      expect(isDirty.value).toBe(true);
    });

    it('should allow manual dirty state setting', () => {
      const { setDirty, isDirty } = useValidation(testSchema, formData.value);

      expect(isDirty.value).toBe(false);

      setDirty();
      expect(isDirty.value).toBe(true);
    });
  });

  describe('reset', () => {
    it('should reset all validation state', async () => {
      formData.value.email = 'invalid-email';

      const { validate, reset, errors, isValid, isDirty } = useValidation(testSchema, formData.value);

      await validate();

      expect(errors.value.email).toBeDefined();
      expect(isValid.value).toBe(false);
      expect(isDirty.value).toBe(true);

      reset();

      expect(errors.value).toEqual({});
      expect(isValid.value).toBe(false);
      expect(isDirty.value).toBe(false);
    });

    it('should reset after successful validation', async () => {
      formData.value.email = 'test@example.com';
      formData.value.password = 'password123';

      const { validate, reset, errors, isValid, isDirty } = useValidation(testSchema, formData.value);

      await validate();

      expect(isValid.value).toBe(true);
      expect(isDirty.value).toBe(true);

      reset();

      expect(errors.value).toEqual({});
      expect(isValid.value).toBe(false);
      expect(isDirty.value).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle nested field paths in validation errors', async () => {
      const nestedSchema = yup.object({
        user: yup.object({
          profile: yup.object({
            name: yup.string().required(ERRORS.NAME_REQUIRED)
          })
        })
      });

      type NestedForm = {
        user: {
          profile: {
            name: string;
          };
        };
      }

      const nestedData = ref<NestedForm>({
        user: {
          profile: {
            name: ''
          }
        }
      });

      const { validate, errors } = useValidation(nestedSchema, nestedData.value);

      await validate();

      expect(errors.value['user.profile.name']).toBe(ERRORS.NAME_REQUIRED);
    });

    it('should handle validation errors from test functions', async () => {
    // Правильный способ тестирования кастомной валидации в yup
      const invalidSchema = yup.object({
        test: yup.string().test('test', 'Test error', (value) => {
          if (value === 'invalid') {
            return false; // Возвращаем false для ошибки валидации
          }
          return true;
        })
      });

      const testData = ref({ test: 'invalid' });
      const { validate, errors } = useValidation(invalidSchema, testData.value);

      await validate();

      expect(errors.value.test).toBe('Test error');
    });

    it('should handle async validation errors', async () => {
      const asyncSchema = yup.object({
        username: yup.string().test('username', 'Username already exists', async (value) => {
        // Имитация асинхронной проверки
          await new Promise(resolve => setTimeout(resolve, 10));
          return value !== 'taken';
        })
      });

      const testData = ref({ username: 'taken' });
      const { validate, errors } = useValidation(asyncSchema, testData.value);

      await validate();

      expect(errors.value.username).toBe('Username already exists');
    });
  });
});
