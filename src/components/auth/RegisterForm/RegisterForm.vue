<template>
  <v-form @submit.prevent="handleSubmit">
    <v-card-title class="text-h5 text-center mb-4">Регистрация</v-card-title>

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

    <UiSelect
      v-model="formData.role"
      label="Role"
      :items="roleOptions"
      :error="errors.role"
      class="mt-4"
    />

    <UiButton
      type="submit"
      color="primary"
      :loading="isLoading"
      block
      class="mt-6"
    >
      Зарегистрироваться
    </UiButton>

    <div class="text-center mt-4">
      <UiButton
        variant="text"
        color="secondary"
        @click="emit('go-to-login')"
      >
        Назад к входу
      </UiButton>
    </div>
  </v-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';
import { registerSchema } from '../authSchemas';
import { UserRole } from '@/enums/userRoles';
import { useFormState } from '@/composables/useFormState/useFormState';

import UiInput from '@/components/ui/UiInput';
import UiButton from '@/components/ui/UiButton';
import UiSelect from '@/components/ui/UiSelect';

import type { RegisterFormEmits } from './types';
import type { RegisterData } from '@/stores/user/types';
import type { AuthResponse } from '@/api/modules/user/types';

const emit = defineEmits<RegisterFormEmits>();

const userStore = useUserStore();

const roleOptions = [
  { title: 'Ученик', value: UserRole.STUDENT},
  { title: 'Учитель', value: UserRole.TEACHER },
];

const formData = ref<RegisterData>({
  email: '',
  password: '',
  role: UserRole.STUDENT,
});

const {
  handleSubmit,
  isLoading,
  errors,
  validateField
} = useFormState<RegisterData, AuthResponse>({
  formData,
  submitFunction: userStore.register,
  validationSchema: registerSchema,
  loading: userStore.isLoading,
  onSuccess: (response) => {
    emit('success', response);
  }
});
</script>
