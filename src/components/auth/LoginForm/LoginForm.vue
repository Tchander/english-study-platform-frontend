<template>
  <v-form @submit.prevent="handleSubmit">
    <v-card-title class="text-h5 text-center mb-4">Вход в систему</v-card-title>

    <UiInput
      v-model="formData.email"
      label="Email"
      type="email"
      :error="errors.email"
      @blur="() => validateField('email')"
    />

    <UiInput
      v-model="formData.password"
      label="Password"
      type="password"
      :error="errors.password"
      @blur="() => validateField('password')"
      autocomplete="on"
      class="mt-4"
    />

    <UiButton
      type="submit"
      color="primary"
      :loading="isLoading"
      block
      class="mt-6"
    >
      Войти
    </UiButton>

    <div class="text-center mt-4">
      <UiButton
        variant="text"
        color="secondary"
        @click="$emit('go-to-register')"
      >
        Зарегистрироваться
      </UiButton>
    </div>
  </v-form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUserStore } from '@/stores/user';
import { useValidation } from '@/composables/useValidation';
import { loginSchema, type LoginFormData } from '../authSchemas';

import UiInput from '@/components/ui/UiInput';
import UiButton from '@/components/ui/UiButton';

type Emits = {
  (e: 'success'): void;
  (e: 'go-to-register'): void;
}

const emit = defineEmits<Emits>();

const userStore = useUserStore();

const formData = ref<LoginFormData>({
  email: '',
  password: '',
});

const {
  errors,
  validate,
  validateField,
} = useValidation<LoginFormData>(loginSchema, formData.value);

const isLoading = computed(() => userStore.isLoading);

const handleSubmit = async () => {
  const isFormValid = await validate();

  if (!isFormValid) return;

  try {
    await userStore.login(formData.value.email, formData.value.password);
    emit('success');
  } catch (error) {
    // Ошибка автоматически обрабатывается в сторе и TanStack Query
    console.error('Login error:', error);
  }
};
</script>
