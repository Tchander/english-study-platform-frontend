<template>
  <div class="auth-page">
    <div class="auth-form">
      <LoginForm @success="handleLoginSuccess" @go-to-register="goToRegister" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import LoginForm from '@/components/auth/LoginForm/LoginForm.vue';

const router = useRouter();

const handleLoginSuccess = () => {
  router.push('/');
};

const goToRegister = () => {
  router.push('/register');
};
</script>

<style lang="scss" scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.auth-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}
</style>
