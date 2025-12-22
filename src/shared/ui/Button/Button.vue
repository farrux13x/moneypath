<template>
  <button
    :class="[
      'button',
      `button--${variant}`,
      `button--${size}`,
      { 'button--full-width': fullWidth },
    ]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  fullWidth: false,
  disabled: false,
})

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<style scoped>
.button {
  font-weight: 500;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.button--sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.button--md {
  padding: 0.625rem 1.25rem;
  font-size: 1rem;
}

.button--lg {
  padding: 0.75rem 1.5rem;
  font-size: 1.125rem;
}

.button--primary {
  background-color: var(--primary-color);
  color: white;
}

.button--primary:hover:not(:disabled) {
  background-color: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.button--secondary {
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
}

.button--secondary:hover:not(:disabled) {
  background-color: var(--border-color);
}

.button--danger {
  background-color: var(--danger-color);
  color: white;
}

.button--danger:hover:not(:disabled) {
  background-color: #dc2626;
}

.button--success {
  background-color: var(--success-color);
  color: white;
}

.button--success:hover:not(:disabled) {
  background-color: #059669;
}

.button--full-width {
  width: 100%;
}
</style>
