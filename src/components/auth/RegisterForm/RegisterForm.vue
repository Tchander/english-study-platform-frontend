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
        @click="$emit('go-to-login')"
      >
        Назад к входу
      </UiButton>
    </div>
  </v-form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUserStore } from '@/stores/user';
import { useValidation } from '@/composables/useValidation';
import { registerSchema } from '../authSchemas';
import { UserRole } from '@/enums/userRoles';
import type { RegisterFormEmits, RegisterFormData } from './types';

import UiInput from '@/components/ui/UiInput';
import UiButton from '@/components/ui/UiButton';
import UiSelect from '@/components/ui/UiSelect';

const emit = defineEmits<RegisterFormEmits>();

const userStore = useUserStore();

const roleOptions = [
  { title: 'Ученик', value: UserRole.STUDENT},
  { title: 'Учитель', value: UserRole.TEACHER },
];

const formData = ref<RegisterFormData>({
  email: '',
  password: '',
  role: UserRole.STUDENT,
});

const {
  errors,
  validate,
  validateField,
} = useValidation<RegisterFormData>(registerSchema, formData.value);

const isLoading = computed(() => userStore.isLoading);

const handleSubmit = async () => {
  const isFormValid = await validate();

  if (!isFormValid) return;

  try {
    await userStore.register(formData.value);
    emit('success');
  } catch (error) {
    console.error('Register error:', error);
  }
};
</script>
