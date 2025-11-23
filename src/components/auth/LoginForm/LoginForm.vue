<template>
  <v-form @submit.prevent="handleSubmit">
    <v-card-title class="text-h5 text-center mb-4">Вход в систему</v-card-title>

    <AppInput
      v-model="form.email"
      label="Email"
      type="email"
      :error="errors.email"
      required
    />

    <AppInput
      v-model="form.password"
      label="Пароль"
      type="password"
      :error="errors.password"
      required
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
import { reactive, ref } from 'vue';
import { useUserStore } from '@/stores/user';

import AppInput from '@/components/ui/AppInput.vue';
import AppButton from '@/components/ui/AppButton.vue';

type Emits = {
  (e: 'success'): void;
  (e: 'go-to-register'): void;
}

const emit = defineEmits<Emits>();

const userStore = useUserStore();
const isLoading = ref(false);

const form = reactive({
  email: '',
  password: '',
});

const errors = reactive({
  email: '',
  password: '',
});

const validateForm = (): boolean => {
  let isValid = true;

  // Сбрасываем ошибки
  errors.email = '';
  errors.password = '';

  if (!form.email) {
    errors.email = 'Email обязателен';
    isValid = false;
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = 'Некорректный email';
    isValid = false;
  }

  if (!form.password) {
    errors.password = 'Пароль обязателен';
    isValid = false;
  } else if (form.password.length < 6) {
    errors.password = 'Пароль должен быть не менее 6 символов';
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  try {
    isLoading.value = true;
    await userStore.login(form.email, form.password);
    emit('success');
  } catch (error) {
    // Ошибка уже обработана в store
  } finally {
    isLoading.value = false;
  }
};
</script>
