<template>
  <Card>
    <div class="statistics-card">
      <div class="statistics-card-header">
        <h3 class="statistics-card-title">{{ title }}</h3>
        <div v-if="icon" class="statistics-card-icon">{{ icon }}</div>
      </div>
      <div class="statistics-card-content">
        <div class="statistics-card-value">{{ value }}</div>
        <div v-if="subtitle" class="statistics-card-subtitle">{{ subtitle }}</div>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { Card } from '@/shared/ui/Card'

interface Props {
  title: string
  value: string | number
  subtitle?: string
  icon?: string
}

defineProps<Props>()
</script>

<style scoped>
.statistics-card {
  padding: 0;
}

.statistics-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.statistics-card-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.statistics-card-icon {
  font-size: 1.5rem;
}

.statistics-card-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.statistics-card-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
}

.statistics-card-subtitle {
  font-size: 0.875rem;
  color: var(--text-secondary);
}
</style>


