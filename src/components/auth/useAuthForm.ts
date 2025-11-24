import { computed } from 'vue';
import { useFormState, type UseFormOptions } from '@/composables/useFormState';
import { useValidation } from '@/composables/useValidation';

export function useAuthForm<T extends object, R = any>(
  options: UseFormOptions<T, R> & { validationSchema?: any }
) {
  const { validateForm, errors: validationErrors, markFieldAsTouched } =
    options.validationSchema ? useValidation(options.validationSchema) : {
      validateForm: async () => true,
      errors: { value: {} },
      markFieldAsTouched: () => {}
    };

  const form = useFormState({
    ...options,
    validate: async (data: T) => {
      if (options.validationSchema) {
        return await validateForm(data);
      }
      return options.validate ? await options.validate(data) : true;
    },
  });

  // Комбинируем ошибки валидации и серверные ошибки
  const allErrors = computed(() => ({
    ...validationErrors.value,
    ...form.formState.errors,
  }));

  const handleFieldBlur = (field: keyof T) => {
    markFieldAsTouched(field);
  };

  return {
    ...form,
    errors: allErrors,
    handleFieldBlur,
  };
}
