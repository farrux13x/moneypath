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

<style scoped src="./Input.css"></style>
