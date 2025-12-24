<template>
  <Card>
    <div :class="$style['statistics-card']">
      <div :class="$style['statistics-card-header']">
        <h3 :class="$style['statistics-card-title']">{{ title }}</h3>
        <div v-if="icon" :class="$style['statistics-card-icon']">{{ icon }}</div>
      </div>
      <div :class="$style['statistics-card-content']">
        <div :class="$style['statistics-card-value']">{{ value }}</div>
        <div v-if="subtitle" :class="$style['statistics-card-subtitle']">
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

<style module src="./StatisticsCard.module.css"></style>
