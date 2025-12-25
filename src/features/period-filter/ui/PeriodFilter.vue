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
import { ref, computed } from 'vue'
import { useI18n } from '@/shared/i18n'

type Period = 'daily' | 'weekly' | 'monthly' | 'yearly'

const emit = defineEmits<{
  'period-change': [period: Period]
}>()

const selectedPeriod = ref<Period>('monthly')
const { t } = useI18n()

const periods = computed<{ id: Period; label: string }[]>(() => [
  { id: 'daily', label: t('features.periodFilter.daily') },
  { id: 'weekly', label: t('features.periodFilter.weekly') },
  { id: 'monthly', label: t('features.periodFilter.monthly') },
  { id: 'yearly', label: t('features.periodFilter.yearly') },
])

const selectPeriod = (period: Period) => {
  selectedPeriod.value = period
  emit('period-change', period)
}
</script>

<style scoped src="./PeriodFilter.css"></style>
