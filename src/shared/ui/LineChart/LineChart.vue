<template>
  <div class="line-chart">
    <svg :width="width" :height="height" viewBox="0 0 400 300">
      <!-- Grid lines -->
      <g v-for="i in 5" :key="i" class="grid-line">
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

      <!-- Line path -->
      <path
        :d="linePath"
        fill="none"
        :stroke="color"
        stroke-width="3"
        class="line"
      />

      <!-- Area under line -->
      <path :d="areaPath" :fill="color" opacity="0.2" class="area" />

      <!-- Data points -->
      <circle
        v-for="(point, index) in points"
        :key="index"
        :cx="point.x"
        :cy="point.y"
        r="4"
        :fill="color"
        class="point"
      />

      <!-- X-axis labels -->
      <text
        v-for="(point, index) in points"
        :key="`label-${index}`"
        :x="point.x"
        :y="height - padding + 20"
        text-anchor="middle"
        font-size="11"
        fill="var(--text-secondary)"
      >
        {{ point.label }}
      </text>

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

interface LineData {
  label: string
  value: number
}

interface Props {
  data: LineData[]
  width?: number
  height?: number
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: 400,
  height: 300,
      color: '#2f7f7b',
})

const padding = 50
const chartHeight = props.height - padding * 2 - 40
const chartWidth = props.width - padding * 2

const maxValue = computed(() => {
  if (props.data.length === 0) return 1
  return Math.max(...props.data.map((d) => d.value), 0) || 1
})

const points = computed(() => {
  return props.data.map((item, index) => {
    const x = padding + (index / (props.data.length - 1 || 1)) * chartWidth
    const y =
      padding + chartHeight - (item.value / maxValue.value) * chartHeight
    return {
      x,
      y,
      label: item.label,
      value: item.value,
    }
  })
})

const linePath = computed(() => {
  if (points.value.length === 0) return ''
  return points.value.reduce((path, point, index) => {
    return (
      path +
      (index === 0 ? `M ${point.x} ${point.y}` : ` L ${point.x} ${point.y}`)
    )
  }, '')
})

const areaPath = computed(() => {
  if (points.value.length === 0) return ''
  const firstPoint = points.value[0]
  const lastPoint = points.value[points.value.length - 1]
  return `${linePath.value} L ${lastPoint.x} ${padding + chartHeight} L ${firstPoint.x} ${padding + chartHeight} Z`
})
</script>

<style scoped src="./LineChart.css"></style>
