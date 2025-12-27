<template>
  <header class="mobile-header mobile-only">
    <h1 class="mobile-title">{{ title }}</h1>
    <div class="header-actions">
      <slot></slot>
    </div>
  </header>
</template>

<script setup lang="ts">
interface Props {
  title: string
}

defineProps<Props>()
</script>

<style scoped src="./HomeMobileHeader.css"></style>
