<template>
  <v-text-field
    v-model="modelValue"
    v-bind="$attrs"
    :error-messages="error"
    variant="outlined"
    density="comfortable"
  >
    <template v-for="(slot, name) in $slots" #[name]>
      <slot :name="name" />
    </template>
  </v-text-field>
</template>

<script setup lang="ts">
import { UiInputProps, UiInputModelValue } from './types';

const { error } = defineProps<UiInputProps>()

const modelValue = defineModel<UiInputModelValue>()
</script>
