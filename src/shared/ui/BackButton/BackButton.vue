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

<style scoped>
.back-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-md);
  color: white;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  margin-bottom: 1rem;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateX(-2px);
}

.back-button:active {
  transform: translateX(-2px) scale(0.98);
}

.back-icon {
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1;
}

.back-text {
  font-weight: 500;
}

@media (min-width: 768px) {
  .back-button {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }
}
</style>


