<template>
  <div :class="$style['period-filter']">
    <div :class="$style['period-buttons']">
      <button
        v-for="period in periods"
        :key="period.id"
        :class="[$style['period-button'], { [$style.active]: selectedPeriod === period.id }]"
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

<style module src="./PeriodFilter.module.css"></style>
