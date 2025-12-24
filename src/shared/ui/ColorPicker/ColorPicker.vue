<template>
  <div :class="$style['color-picker-wrapper']">
    <label v-if="label" :class="$style['input-label']">{{ label }}</label>
    <div :class="$style['color-picker']">
      <input
        type="color"
        :value="modelValue"
        @input="
          $emit('update:modelValue', ($event.target as HTMLInputElement).value)
        "
        :class="$style['color-input']"
      />
      <input
        type="text"
        :value="modelValue"
        @input="
          $emit('update:modelValue', ($event.target as HTMLInputElement).value)
        "
        :class="$style['color-text-input']"
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

<style module src="./ColorPicker.module.css"></style>
