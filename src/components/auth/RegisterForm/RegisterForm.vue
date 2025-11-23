<template>
  <v-form @submit.prevent="handleSubmit">
    <v-card-title class="text-h5 text-center mb-4">Регистрация</v-card-title>

    <AppInput
      v-model="formData.email"
      label="Email"
      type="email"
      :error="errors.email"
      @blur="() => validateField('email')"
    />

    <AppInput
      v-model="formData.password"
      label="Password"
      type="password"
      :error="errors.password"
      @blur="() => validateField('password')"
      class="mt-4"
    />

    <AppSelect
      v-model="formData.role"
      label="Role"
      :items="roleOptions"
      :error="errors.role"
      class="mt-4"
    />

    <AppButton
      type="submit"
      color="primary"
      :loading="isLoading"
      block
      class="mt-6"
    >
      Зарегистрироваться
    </AppButton>

    <div class="text-center mt-4">
      <AppButton
        variant="text"
        color="secondary"
        @click="$emit('go-to-login')"
      >
        Назад к входу
      </AppButton>
    </div>
  </v-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';
import { useValidation } from '@/composables/useValidation';
import { registerSchema, type RegisterFormData } from '../authSchemas'

import AppInput from '@/components/ui/AppInput.vue';
import AppButton from '@/components/ui/AppButton.vue';
import AppSelect from '@/components/ui/AppSelect.vue';

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
