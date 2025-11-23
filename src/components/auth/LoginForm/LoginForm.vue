<template>
  <v-form @submit.prevent="handleSubmit">
    <v-card-title class="text-h5 text-center mb-4">Вход в систему</v-card-title>

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
      autocomplete="on"
      class="mt-4"
    />

    <AppButton
      type="submit"
      color="primary"
      :loading="isLoading"
      block
      class="mt-6"
    >
      Войти
    </AppButton>

    <div class="text-center mt-4">
      <AppButton
        variant="text"
        color="secondary"
        @click="$emit('go-to-register')"
      >
        Зарегистрироваться
      </AppButton>
    </div>
  </v-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';
import { useValidation } from '@/composables/useValidation';
import { loginSchema, type LoginFormData } from '../authSchemas'

import AppInput from '@/components/ui/AppInput.vue';
import AppButton from '@/components/ui/AppButton.vue';

type Emits = {
  (e: 'success'): void;
  (e: 'go-to-register'): void;
}

const emit = defineEmits<Emits>();

const userStore = useUserStore();
const isLoading = ref(false);

const formData = ref<LoginFormData>({
  email: '',
  password: '',
});

const {
  errors,
  validate,
  validateField,
} = useValidation<LoginFormData>(loginSchema, formData.value);

const handleSubmit = async () => {
  const isFormValid = await validate();

  if (!isFormValid) return;

  try {
    isLoading.value = true;
    await userStore.login(formData.value.email, formData.value.password);
    emit('success');
  } catch (error) {
    // Ошибка уже обработана в store
  } finally {
    isLoading.value = false;
  }
};
</script>
