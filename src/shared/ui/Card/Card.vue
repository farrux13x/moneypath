<template>
  <div :class="[$style.card, { [$style['card--padded']]: padded }]">
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

<style module src="./Card.module.css"></style>
