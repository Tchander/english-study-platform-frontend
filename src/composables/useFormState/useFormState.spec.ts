import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref } from 'vue';
import * as yup from 'yup';
import { useFormState } from './useFormState';

enum ERRORS {
  EMAIL_REQUIRED = 'Email обязателен',
  EMAIL_INVALID = 'Некорректный формат email',
  NAME_REQUIRED = 'Имя обязательно'
}

const formSchema = yup.object({
  name: yup.string()
    .required(ERRORS.NAME_REQUIRED),
  email: yup.string()
    .email(ERRORS.EMAIL_INVALID)
    .required(ERRORS.EMAIL_REQUIRED),
});

type FormData = yup.InferType<typeof formSchema>;

describe('useFormState', () => {
  const mockSubmit = vi.fn();
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle successful form submission', async () => {
    const formData = ref<FormData>({
      name: 'John',
      email: 'john@example.com'
    });

    mockSubmit.mockResolvedValue('success');

    const { handleSubmit, isLoading, errors } = useFormState({
      formData,
      validationSchema: formSchema,
      submitFunction: mockSubmit,
      onSuccess: mockOnSuccess,
    });

    await handleSubmit();

    expect(mockSubmit).toHaveBeenCalledWith({ name: 'John', email: 'john@example.com' });
    expect(mockOnSuccess).toHaveBeenCalledWith('success');
    expect(errors.value).toEqual({});
    expect(isLoading.value).toBeUndefined();
  });

  it('should handle validation errors', async () => {
    const formData = ref<FormData>({
      name: '',
      email: 'invalid-email'
    });

    const { handleSubmit, errors } = useFormState({
      formData,
      validationSchema: formSchema,
      submitFunction: mockSubmit,
    });

    await handleSubmit();

    expect(mockSubmit).not.toHaveBeenCalled();
    expect(errors.value.name).toBe(ERRORS.NAME_REQUIRED);
    expect(errors.value.email).toBe(ERRORS.EMAIL_INVALID);
  });

  it('should handle submission errors', async () => {
    const formData = ref<FormData>({
      name: 'John',
      email: 'john@example.com'
    });
    const submissionError = new Error('API Error');
    mockSubmit.mockRejectedValue(submissionError);

    const { handleSubmit } = useFormState({
      formData,
      validationSchema: formSchema,
      submitFunction: mockSubmit,
    });

    await expect(handleSubmit()).rejects.toThrow('API Error');
  });
});
