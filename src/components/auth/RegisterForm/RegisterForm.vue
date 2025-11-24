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
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';
import { useValidation } from '@/composables/useValidation';
import { registerSchema, type RegisterFormData } from '../authSchemas'

import UiInput from '@/components/ui/UiInput';
import UiButton from '@/components/ui/UiButton';
import UiSelect from '@/components/ui/UiSelect';

type Emits = {
  (e: 'success'): void;
  (e: 'go-to-login'): void;
}

const emit = defineEmits<Emits>();

const userStore = useUserStore();
const isLoading = ref(false);

const roleOptions = [
  { title: 'Ученик', value: 'student' },
  { title: 'Учитель', value: 'teacher' },
];

const formData = ref<RegisterFormData>({
  email: '',
  password: '',
  role: 'student',
});

const {
  errors,
  validate,
  validateField,
} = useValidation<RegisterFormData>(registerSchema, formData.value);

const handleSubmit = async () => {
  const isFormValid = await validate();

  if (!isFormValid) return;

  try {
    isLoading.value = true;
    await userStore.register(formData.value.email, formData.value.password, formData.value.role);
    emit('success');
  } catch (error) {
    // Ошибка уже обработана в store
  } finally {
    isLoading.value = false;
  }
};
</script>
