<template>
  <div class="auth-page">
    <div class="auth-form">
      <RegisterForm @success="handleRegisterSuccess" @go-to-login="goToLogin" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import RegisterForm from '@/components/auth/RegisterForm';

const router = useRouter();

const handleRegisterSuccess = () => {
  router.push('/');
};

const goToLogin = () => {
  router.push('/login');
};
</script>
