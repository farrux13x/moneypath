<template>
  <button
    :class="$style['theme-toggle']"
    @click="toggleTheme"
    :title="`Switch to ${effectiveTheme === 'light' ? 'dark' : 'light'} mode`"
    aria-label="Toggle theme"
  >
    <span :class="$style['theme-icon']">{{ themeIcon }}</span>
    <span :class="$style['theme-label']">{{ themeLabel }}</span>
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

<style module src="./ThemeToggle.module.css"></style>
