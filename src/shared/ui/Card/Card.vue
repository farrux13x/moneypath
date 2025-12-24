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
  padded: true,
})
</script>

<style scoped src="./Card.css"></style>
