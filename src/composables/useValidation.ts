// src/composables/useValidation.ts
import { ref, type Ref, type UnwrapNestedRefs } from 'vue';
import { type AnyObjectSchema, ValidationError } from 'yup';

export function useValidation<T extends Record<string, any>>(
  schema: AnyObjectSchema,
  formData: UnwrapNestedRefs<T>
) {
  const errors = ref<Record<keyof T, string>>({} as Record<keyof T, string>);
  const isValid = ref(false);
  const isDirty = ref(false);

  /**
   * Валидация данных по схеме
   */
  const validate = async (): Promise<boolean> => {
    try {
      isDirty.value = true;
      await schema.validate(formData, { abortEarly: false });

      errors.value = {} as Record<keyof T, string>;
      isValid.value = true;
      return true;

    } catch (error) {
      isValid.value = false;

      if (error instanceof ValidationError) {
        const newErrors = {} as Record<keyof T, string>;
        error.inner.forEach((err) => {
          if (err.path) {
            newErrors[err.path as keyof T] = err.message;
          }
        });
        errors.value = newErrors;
      }
      return false;
    }
  };

  /**
   * Валидация конкретного поля
   */
  const validateField = async (field: keyof T): Promise<void> => {
    try {
      isDirty.value = true;
      await schema.validateAt(field as string, formData);

      // Убираем ошибку для этого поля
      if (errors.value[field]) {
        delete errors.value[field];
      }

      // Проверяем общую валидность
      await validate();

    } catch (error) {
      if (error instanceof ValidationError) {
        errors.value[field] = error.message;
        isValid.value = false;
      }
    }
  };

  /**
   * Ручная установка isDirty
   */
  const setDirty = (): void => {
    isDirty.value = true;
  };

  /**
   * Сброс ошибок и состояния
   */
  const reset = (): void => {
    errors.value = {} as Record<keyof T, string>;
    isValid.value = false;
    isDirty.value = false;
  };

  return {
    errors: errors as Ref<Record<keyof T, string>>,
    isValid,
    isDirty,
    validate,
    validateField,
    setDirty,
    reset
  };
}
