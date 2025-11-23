<template>
  <v-btn
    v-bind="$attrs"
    :loading="loading"
    :disabled="disabled"
    @click="$emit('click')"
    class="text-none"
    :color="color"
  >
    <slot />
  </v-btn>
</template>

<script setup lang="ts">
defineProps<{
  loading?: boolean;
  disabled?: boolean;
  color?: string;
}>();

defineEmits<{
  click: [];
}>();
</script>
