<template>
  <button class="back-button" @click="handleBack" aria-label="Go back">
    <span class="back-icon">←</span>
    <span class="back-text">Back</span>
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

<style scoped src="./BackButton.css"></style>
