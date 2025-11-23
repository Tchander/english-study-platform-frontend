<template>
  <v-select
    v-bind="$attrs"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
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
defineProps<{
  modelValue: string;
  items: { title: string; value: string }[];
  error?: string;
}>();

defineEmits<{
  'update:modelValue': [value: string];
}>();
</script>
