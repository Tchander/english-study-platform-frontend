<template>
  <v-btn
    v-bind="$attrs"
    class="text-none"
    :loading="loading"
    :disabled="disabled"
    :color="color"
    @click="emit('click')"
  >
    <slot />
  </v-btn>
</template>

<script setup lang="ts">
import type { UiButtonEmits, UiButtonProps } from './types';

const emit = defineEmits<UiButtonEmits>();
const { loading, color, disabled } = defineProps<UiButtonProps>();
</script>
