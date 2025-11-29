<template>
  <div class="auth-page">
    <div class="auth-form">
      <LoginForm @success="handleLoginSuccess" @go-to-register="goToRegister" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import LoginForm from '@/components/auth/LoginForm';

const router = useRouter();

const handleLoginSuccess = () => {
  router.push('/');
};

const goToRegister = () => {
  router.push('/register');
};
</script>
