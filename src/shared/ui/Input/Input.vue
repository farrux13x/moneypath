<template>
  <div class="input-wrapper">
    <label v-if="label" :for="inputId" class="input-label">{{ label }}</label>
    <input
      :id="inputId"
      :type="type"
      :value="modelValue ?? ''"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="['input', { 'input--error': error }]"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
    />
    <span v-if="error" class="input-error">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: string | number | null
  type?: 'text' | 'number' | 'date' | 'email' | 'password'
  label?: string
  placeholder?: string
  error?: string
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
})

defineEmits<{
  'update:modelValue': [value: string | number | null]
}>()

const inputId = computed(
  () => `input-${Math.random().toString(36).substr(2, 9)}`,
)
</script>

<style scoped>
.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
}

.input {
  width: 100%;
  padding: 0.625rem 0.875rem;
  font-size: 1rem;
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: all 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgb(99 102 241 / 0.1);
}

.input:disabled {
  background-color: var(--bg-tertiary);
  cursor: not-allowed;
}

.input--error {
  border-color: var(--danger-color);
}

.input--error:focus {
  box-shadow: 0 0 0 3px rgb(239 68 68 / 0.1);
}

.input-error {
  font-size: 0.875rem;
  color: var(--danger-color);
}
</style>
