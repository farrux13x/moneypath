<template>
  <div :class="$style['pie-chart']">
    <svg :width="size" :height="size + 100" viewBox="0 0 200 300">
      <g transform="translate(100, 100)">
        <path
          v-for="(slice, index) in slices"
          :key="index"
          :d="slice.path"
          :fill="slice.color"
          :opacity="hoveredIndex === index ? 0.8 : 1"
          :class="$style['slice']"
          @mouseenter="hoveredIndex = index"
          @mouseleave="hoveredIndex = null"
        />
        <!-- Labels -->
        <text
          v-for="(slice, index) in slices"
          :key="`label-${index}`"
          :x="slice.labelX"
          :y="slice.labelY"
          text-anchor="middle"
          font-size="10"
          fill="white"
          font-weight="600"
        >
          {{ slice.percentage > 5 ? `${slice.percentage}%` : '' }}
        </text>
      </g>
      <!-- Legend -->
      <g transform="translate(0, 210)">
        <rect
          v-for="(slice, index) in slices"
          :key="`legend-${index}`"
          :x="0"
          :y="index * 20"
          width="12"
          height="12"
          :fill="slice.color"
        />
        <text
          v-for="(slice, index) in slices"
          :key="`legend-text-${index}`"
          :x="15"
          :y="index * 20 + 9"
          font-size="11"
          fill="var(--text-primary)"
        >
          {{ slice.label }} ({{ formatValue(slice.value) }})
        </text>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface PieData {
  label: string
  value: number
  color: string
}

interface Props {
  data: PieData[]
  size?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 200,
})

const hoveredIndex = ref<number | null>(null)

const total = computed(() => {
  return props.data.reduce((sum, item) => sum + item.value, 0)
})

const slices = computed(() => {
  let currentAngle = -90 // Start from top
  const radius = 80

  return props.data.map((item) => {
    const percentage = total.value > 0 ? (item.value / total.value) * 100 : 0
    const angle = (item.value / total.value) * 360

    const startAngle = currentAngle
    const endAngle = currentAngle + angle

    const startAngleRad = (startAngle * Math.PI) / 180
    const endAngleRad = (endAngle * Math.PI) / 180

    const x1 = radius * Math.cos(startAngleRad)
    const y1 = radius * Math.sin(startAngleRad)
    const x2 = radius * Math.cos(endAngleRad)
    const y2 = radius * Math.sin(endAngleRad)

    const largeArcFlag = angle > 180 ? 1 : 0

    const path = `
      M 0 0
      L ${x1} ${y1}
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
      Z
    `

    // Label position (middle of slice)
    const labelAngle = (startAngle + endAngle) / 2
    const labelAngleRad = (labelAngle * Math.PI) / 180
    const labelRadius = radius * 0.6
    const labelX = labelRadius * Math.cos(labelAngleRad)
    const labelY = labelRadius * Math.sin(labelAngleRad)

    currentAngle += angle

    return {
      ...item,
      path,
      percentage: Math.round(percentage),
      labelX,
      labelY,
    }
  })
})

const formatValue = (value: number): string => {
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}k`
  }
  return `$${value.toFixed(2)}`
}
</script>

<style module src="./PieChart.module.css"></style>
