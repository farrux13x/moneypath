<template>
  <div :class="$style['bar-chart']">
    <svg :width="width" :height="height" viewBox="0 0 400 300">
      <!-- Grid lines -->
      <g v-for="i in 5" :key="i" :class="$style['grid-line']">
        <line
          :x1="padding"
          :y1="padding + (i - 1) * (chartHeight / 4)"
          :x2="width - padding"
          :y2="padding + (i - 1) * (chartHeight / 4)"
          stroke="var(--border-color)"
          stroke-width="1"
          stroke-dasharray="2,2"
        />
      </g>

      <!-- Bars -->
      <g v-for="(item, index) in data" :key="index">
        <rect
          :x="padding + index * barWidth + index * barSpacing"
          :y="padding + chartHeight - (item.value / maxValue) * chartHeight"
          :width="barWidth"
          :height="(item.value / maxValue) * chartHeight"
          :fill="item.color || color"
          :class="$style['bar']"
          :style="{ transition: 'all 0.3s ease' }"
        />
        <!-- Value label on top of bar -->
        <text
          :x="padding + index * barWidth + index * barSpacing + barWidth / 2"
          :y="padding + chartHeight - (item.value / maxValue) * chartHeight - 5"
          text-anchor="middle"
          font-size="12"
          fill="var(--text-secondary)"
        >
          {{ formatValue(item.value) }}
        </text>
        <!-- Category label -->
        <text
          :x="padding + index * barWidth + index * barSpacing + barWidth / 2"
          :y="height - padding + 20"
          text-anchor="middle"
          font-size="11"
          fill="var(--text-secondary)"
          transform="rotate(-45, padding + index * barWidth + index * barSpacing + barWidth / 2, height - padding + 20)"
        >
          {{ item.label }}
        </text>
      </g>

      <!-- Y-axis label -->
      <text
        x="15"
        y="padding + chartHeight / 2"
        text-anchor="middle"
        font-size="12"
        fill="var(--text-secondary)"
        transform="rotate(-90, 15, padding + chartHeight / 2)"
      >
        Amount ($)
      </text>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface BarData {
  label: string
  value: number
  color?: string
}

interface Props {
  data: BarData[]
  width?: number
  height?: number
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: 400,
  height: 300,
  color: '#6366f1',
})

const padding = 50
const barSpacing = 10
const chartHeight = props.height - padding * 2 - 40

const barWidth = computed(() => {
  const totalSpacing = (props.data.length - 1) * barSpacing
  return (props.width - padding * 2 - totalSpacing) / props.data.length
})

const maxValue = computed(() => {
  if (props.data.length === 0) return 1
  return Math.max(...props.data.map((d) => d.value), 0) || 1
})

const formatValue = (value: number): string => {
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}k`
  }
  return `$${value.toFixed(0)}`
}
</script>

<style module src="./BarChart.module.css"></style>
