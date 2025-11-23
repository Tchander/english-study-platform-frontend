<template>
  <v-text-field
    v-bind="$attrs"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
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
defineProps<{
  modelValue: string;
  error?: string;
}>();

defineEmits<{
  'update:modelValue': [value: string];
}>();
</script>
