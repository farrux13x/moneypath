<template>
  <Card>
    <div class="statistics-card">
      <div class="statistics-card-header">
        <h3 class="statistics-card-title">{{ title }}</h3>
        <div v-if="icon" class="statistics-card-icon">{{ icon }}</div>
      </div>
      <div class="statistics-card-content">
        <div class="statistics-card-value">{{ value }}</div>
        <div v-if="subtitle" class="statistics-card-subtitle">
          {{ subtitle }}
        </div>
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

<style scoped src="./StatisticsCard.css"></style>
