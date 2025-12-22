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
  { id: 'auto', name: 'Auto (System)', icon: '🔄' }
]
</script>

<style scoped>
.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.section-description {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

.theme-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.theme-option {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  text-align: left;
}

.theme-option:hover {
  background-color: var(--bg-tertiary);
  border-color: var(--primary-color);
}

.theme-option.active {
  background-color: var(--bg-primary);
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.theme-icon {
  font-size: 1.5rem;
  width: 2rem;
  text-align: center;
}

.theme-name {
  flex: 1;
  font-weight: 500;
  color: var(--text-primary);
}

.theme-check {
  color: var(--primary-color);
  font-weight: 700;
  font-size: 1.25rem;
}
</style>


