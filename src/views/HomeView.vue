<template>
  <v-container>
    <v-card class="pa-6">
      <v-card-title class="text-h4 mb-4">Добро пожаловать!</v-card-title>

      <v-card-text v-if="userStore.user">
        <p class="text-h6">Информация о пользователе:</p>
        <v-list>
          <v-list-item>
            <v-list-item-title>Email: {{ userStore.user.email }}</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>Роль: {{ userRoles[userStore.user.role] }}</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>ID: {{ userStore.user.id }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card-text>

      <v-card-actions>
        <AppButton color="error" @click="handleLogout">
          Выйти
        </AppButton>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

import AppButton from '@/components/ui/AppButton.vue';

const userStore = useUserStore();
const router = useRouter();

const userRoles = {
  'student': 'Ученик',
  'teacher': 'Учитель',
  'super-admin': 'Главный администратор'
}

onMounted(async () => {
  if (!userStore.user) {
    try {
      await userStore.fetchProfile();
    } catch (error) {
      router.push('/login');
    }
  }
});

const handleLogout = () => {
  userStore.logout();
  router.push('/login');
};
</script>
