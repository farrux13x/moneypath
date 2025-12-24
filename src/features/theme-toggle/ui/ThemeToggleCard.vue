<template>
  <Card>
    <h2 class="section-title">Theme</h2>
    <p class="section-description">Choose your preferred theme</p>

    <div class="theme-options">
      <button
        v-for="theme in themes"
        :key="theme.id"
        :class="['theme-option', { active: currentTheme === theme.id }]"
        @click="setTheme(theme.id)"
      >
        <span class="theme-icon">{{ theme.icon }}</span>
        <span class="theme-name">{{ theme.name }}</span>
        <span v-if="currentTheme === theme.id" class="theme-check">✓</span>
      </button>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { Card } from '@/shared/ui/Card'
import { useTheme } from '@/shared/lib/theme/useTheme'

const { currentTheme, setTheme } = useTheme()

const themes = [
  { id: 'light', name: 'Light', icon: '☀️' },
  { id: 'dark', name: 'Dark', icon: '🌙' },
  { id: 'auto', name: 'Auto (System)', icon: '🔄' },
] as const
</script>

<style scoped src="./ThemeToggleCard.css"></style>
