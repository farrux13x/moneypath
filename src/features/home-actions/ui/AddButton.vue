<template>
  <button
    class="add-button"
    type="button"
    @click="emitClick"
    :aria-label="ariaLabel"
  >
    <span class="add-icon">+</span>
  </button>
</template>

<script setup lang="ts">
interface Props {
  ariaLabel: string
}

defineProps<Props>()

const emit = defineEmits<{
  click: []
}>()

const emitClick = () => {
  emit('click')
}
</script>

<style scoped src="./AddButton.css"></style>
