import { useValidation, type ValidationErrors } from '../useValidation/useValidation';
import { computed } from 'vue';
import type { Ref, ComputedRef, UnwrapNestedRefs } from 'vue';
import type { AnyObjectSchema } from 'yup';

export type UseFormStateOptions<T, R = void> = {
  formData: Ref<T>;
  validationSchema: AnyObjectSchema;
  submitFunction: (data: T) => Promise<R>;
  loading?: boolean;
  onSuccess?: (response: R) => void;
};

export type UseFormStateReturn<T> = {
  handleSubmit: () => Promise<void>;
  errors: Ref<ValidationErrors>;
  validateField: (field: keyof T) => Promise<void>;
  resetValidation: () => void;
  isLoading: ComputedRef<boolean | undefined>;
};

/**
 * Компосабл для управления состоянием формы
 */
export function useFormState<T, R = void>(options: UseFormStateOptions<T, R>): UseFormStateReturn<T> {
  const {
    formData,
    validationSchema,
    submitFunction,
    loading,
    onSuccess
  } = options;

  // Используем нашу существующую валидацию
  const {
    errors,
    validate,
    validateField,
    reset: resetValidation
  } = useValidation<T>(validationSchema, formData.value as UnwrapNestedRefs<T>);

  const isLoading = computed(() => loading);

  /**
   * Обработчик отправки формы
   */
  const handleSubmit = async (): Promise<void> => {
    if (!formData.value) return;

    const isFormValid = await validate();

    if (!isFormValid) {
      return;
    }

    try {
      const response = await submitFunction(formData.value);
      onSuccess?.(response);
    } catch (error) {
      // Ошибка обрабатывается в сторе/компоненте
      console.error('Form submission error:', error);
      throw error; // Пробрасываем ошибку дальше для обработки в компоненте
    }
  };

  return {
    handleSubmit,
    errors,
    validateField,
    isLoading,
    resetValidation
  };
}
