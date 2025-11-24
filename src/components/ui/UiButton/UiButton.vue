<template>
  <v-btn
    v-bind="$attrs"
    :loading="loading"
    :disabled="disabled"
    @click="emit('click')"
    class="text-none"
    :color="color"
  >
    <slot />
  </v-btn>
</template>

<script setup lang="ts">
import type { UiButtonEmits, UiButtonProps } from './types';

const emit = defineEmits<UiButtonEmits>();
const { loading, color, disabled } = defineProps<UiButtonProps>();
</script>
