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
        @click="emit('go-to-register')"
      >
        Зарегистрироваться
      </UiButton>
    </div>
  </v-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';
import { loginSchema } from '../authSchemas';
import { useFormState } from '@/composables/useFormState';

import UiInput from '@/components/ui/UiInput';
import UiButton from '@/components/ui/UiButton';

import type { LoginFormEmits } from './types';
import type { LoginData } from '@/stores/user/types';
import type { AuthResponse } from '@/api/modules/user/types';

const emit = defineEmits<LoginFormEmits>();

const userStore = useUserStore();

const formData = ref<LoginData>({
  email: '',
  password: '',
});

const {
  handleSubmit,
  isLoading,
  errors,
  validateField
} = useFormState<LoginData, AuthResponse>({
  formData,
  submitFunction: userStore.login,
  validationSchema: loginSchema,
  loading: userStore.isLoading,
  onSuccess: (response) => {
    emit('success', response);
  }
});
</script>
