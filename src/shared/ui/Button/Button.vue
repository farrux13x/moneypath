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

<style scoped src="./Button.css"></style>
