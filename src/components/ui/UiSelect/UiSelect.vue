<template>
  <v-select
    v-bind="$attrs"
    v-model="modelValue"
    :items="items"
    :error-messages="error"
    variant="outlined"
    density="comfortable"
  >
    <template v-for="(slot, name) in $slots" #[name]>
      <slot :name="name" />
    </template>
  </v-select>
</template>

<script setup lang="ts">
import type { UiSelectProps, UiSelectModelValue } from './types';

const { items, error } = defineProps<UiSelectProps>();

const modelValue = defineModel<UiSelectModelValue>();
</script>
