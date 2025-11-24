import { reactive, computed } from 'vue';
import type { ValidationErrors } from './useValidation';

export interface FormState<T> {
  data: T;
  isLoading: boolean;
  errors: ValidationErrors;
  serverError: string | null;
}

export interface UseFormOptions<T, R> {
  initialData: T;
  onSubmit: (data: T) => Promise<R>;
  onSuccess?: (result: R) => void;
  onError?: (error: unknown) => void;
  validate?: (data: T) => Promise<boolean> | boolean;
}

export function useFormState<T extends Record<string, unknown>, R = unknown>(
  options: UseFormOptions<T, R>
) {
  // Создаем реактивное состояние с правильной типизацией
  const formState = reactive<FormState<T>>({
    data: reactive({ ...options.initialData }) as T,
    isLoading: false,
    errors: {},
    serverError: null,
  });

  const setFieldError = (field: keyof T, message: string) => {
    formState.errors[field as string] = message;
  };

  const setServerError = (message: string | null) => {
    formState.serverError = message;
  };

  const resetForm = () => {
    // Безопасный сброс данных с правильной типизацией
    Object.keys(options.initialData).forEach(key => {
      const typedKey = key as keyof T;
      (formState.data as T)[typedKey] = options.initialData[typedKey];
    });
    formState.errors = {};
    formState.serverError = null;
    formState.isLoading = false;
  };

  const handleSubmit = async (): Promise<R | void> => {
    formState.serverError = null;

    // Валидация
    if (options.validate) {
      const isValid = await options.validate(formState.data as T);
      if (!isValid) return;
    }

    try {
      formState.isLoading = true;
      const result = await options.onSubmit(formState.data as T);

      if (options.onSuccess) {
        options.onSuccess(result);
      }

      return result;
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      formState.serverError = errorMessage;

      if (options.onError) {
        options.onError(error);
      }

      throw error;
    } finally {
      formState.isLoading = false;
    }
  };

  // Вспомогательная функция для безопасного получения сообщения об ошибке
  const getErrorMessage = (error: unknown): string => {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as {
        response?: {
          data?: {
            message?: string
          }
        }
      };
      return axiosError.response?.data?.message || 'Произошла ошибка';
    }

    if (error instanceof Error) {
      return error.message;
    }

    if (typeof error === 'string') {
      return error;
    }

    return 'Произошла неизвестная ошибка';
  };

  const hasErrors = computed(() =>
    Object.values(formState.errors).some(error => error !== '') ||
    !!formState.serverError
  );

  return {
    formState,
    setFieldError,
    setServerError,
    resetForm,
    handleSubmit,
    hasErrors,
  };
}
