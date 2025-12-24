<template>
  <div class="color-picker-wrapper">
    <label v-if="label" class="input-label">{{ label }}</label>
    <div class="color-picker">
      <input
        type="color"
        :value="modelValue"
        @input="
          $emit('update:modelValue', ($event.target as HTMLInputElement).value)
        "
        class="color-input"
      />
      <input
        type="text"
        :value="modelValue"
        @input="
          $emit('update:modelValue', ($event.target as HTMLInputElement).value)
        "
        class="color-text-input"
        placeholder="#000000"
        maxlength="7"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string
  label?: string
}

defineProps<Props>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<style scoped src="./ColorPicker.css"></style>
