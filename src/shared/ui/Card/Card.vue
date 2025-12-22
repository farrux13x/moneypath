<template>
  <div :class="['card', { 'card--padded': padded }]">
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  padded?: boolean
}

withDefaults(defineProps<Props>(), {
  padded: true
})
</script>

<style scoped>
.card {
  background-color: var(--bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}

.card--padded {
  padding: 1.5rem;
}

@media (min-width: 768px) {
  .card--padded {
    padding: 2rem;
  }
}
</style>


