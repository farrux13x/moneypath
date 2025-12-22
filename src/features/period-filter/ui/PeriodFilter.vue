<template>
  <div class="period-filter">
    <div class="period-buttons">
      <button
        v-for="period in periods"
        :key="period.id"
        :class="['period-button', { active: selectedPeriod === period.id }]"
        @click="selectPeriod(period.id)"
      >
        {{ period.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

type Period = 'daily' | 'weekly' | 'monthly' | 'yearly'

const emit = defineEmits<{
  'period-change': [period: Period]
}>()

const selectedPeriod = ref<Period>('monthly')

const periods: { id: Period; label: string }[] = [
  { id: 'daily', label: 'Daily' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
  { id: 'yearly', label: 'Yearly' },
]

const selectPeriod = (period: Period) => {
  selectedPeriod.value = period
  emit('period-change', period)
}
</script>

<style scoped>
.period-filter {
  margin-bottom: 2rem;
}

.period-buttons {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding: 0.5rem 0;
  -webkit-overflow-scrolling: touch;
}

.period-button {
  padding: 0.625rem 1.25rem;
  background-color: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;
}

.period-button:hover {
  background-color: var(--bg-tertiary);
  border-color: var(--primary-color);
}

.period-button.active {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

@media (max-width: 640px) {
  .period-button {
    padding: 0.5rem 1rem;
    font-size: 0.8125rem;
  }
}
</style>
