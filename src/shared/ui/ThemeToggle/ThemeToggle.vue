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

<style scoped>
.theme-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-md);
  color: white;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.theme-toggle:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.theme-icon {
  font-size: 1.125rem;
}

.theme-label {
  font-weight: 500;
}

@media (max-width: 640px) {
  .theme-toggle {
    padding: 0.5rem;
  }

  .theme-label {
    display: none;
  }
}
</style>
