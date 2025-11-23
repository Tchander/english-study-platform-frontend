<template>
  <v-form @submit.prevent="handleSubmit">
    <v-card-title class="text-h5 text-center mb-4">Регистрация</v-card-title>

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

    <AppSelect
      v-model="form.role"
      label="Роль"
      :items="roleOptions"
      :error="errors.role"
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
import { reactive, ref } from 'vue';
import { useUserStore } from '@/stores/user';

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

const form = reactive({
  email: '',
  password: '',
  role: 'student' as 'student' | 'teacher',
});

const errors = reactive({
  email: '',
  password: '',
  role: '',
});

const validateForm = (): boolean => {
  let isValid = true;

  // Сбрасываем ошибки
  errors.email = '';
  errors.password = '';
  errors.role = '';

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

  if (!form.role) {
    errors.role = 'Роль обязательна';
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  try {
    isLoading.value = true;
    await userStore.register(form.email, form.password, form.role);
    emit('success');
  } catch (error) {
    // Ошибка уже обработана в store
  } finally {
    isLoading.value = false;
  }
};
</script>
