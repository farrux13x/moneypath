<template>
  <button :class="$style['back-button']" @click="handleBack" aria-label="Go back">
    <span :class="$style['back-icon']">←</span>
    <span :class="$style['back-text']">Back</span>
  </button>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  back: []
}>()

const handleBack = () => {
  if (window.history.length > 1) {
    window.history.back()
  } else {
    window.location.hash = ''
  }
  emit('back')
}
</script>

<style module src="./BackButton.module.css"></style>
