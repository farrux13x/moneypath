<template>
  <Card>
    <h2 class="section-title">{{ t('features.themeToggle.title') }}</h2>
    <p class="section-description">{{ t('features.themeToggle.description') }}</p>

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
import { computed } from 'vue'
import { Card } from '@/shared/ui/Card'
import { useTheme } from '@/shared/lib/theme/useTheme'
import { useI18n } from '@/shared/i18n'

const { currentTheme, setTheme } = useTheme()
const { t } = useI18n()

const themes = computed(
  () =>
    [
      { id: 'light', name: t('features.themeToggle.light'), icon: '?~??,?' },
      { id: 'dark', name: t('features.themeToggle.dark'), icon: 'dYOT' },
      { id: 'auto', name: t('features.themeToggle.auto'), icon: 'dY",' },
    ] as const,
)
</script>

<style scoped src="./ThemeToggleCard.css"></style>
