<template>
  <button
    class="theme-toggle"
    @click="toggleTheme"
    :title="`Switch to ${effectiveTheme === 'light' ? 'dark' : 'light'} mode`"
    aria-label="Toggle theme"
  >
    <span class="theme-icon">{{ themeIcon }}</span>
    <span class="theme-label">{{ themeLabel }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from '@/shared/lib/theme/useTheme'

const { effectiveTheme, toggleTheme } = useTheme()

const themeIcon = computed(() => {
  const theme = effectiveTheme.value
  if (theme === 'dark') {
    return '☀️'
  }
  return '🌙'
})

const themeLabel = computed(() => {
  const theme = effectiveTheme.value
  return theme === 'dark' ? 'Light' : 'Dark'
})
</script>

<style scoped src="./ThemeToggle.css"></style>
