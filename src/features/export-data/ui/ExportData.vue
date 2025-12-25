<template>
  <Card>
    <h2 class="section-title">{{ t('features.exportData.title') }}</h2>
    <p class="section-description">
      {{ t('features.exportData.description') }}
    </p>

    <div class="export-options">
      <div class="export-option">
        <label class="checkbox-label">
          <input
            type="checkbox"
            v-model="exportOptions.expenses"
            class="checkbox"
          />
          <span>{{ t('features.exportData.exportExpenses', { count: expensesCount }) }}</span>
        </label>
      </div>

      <div class="export-option">
        <label class="checkbox-label">
          <input
            type="checkbox"
            v-model="exportOptions.categories"
            class="checkbox"
          />
          <span>{{ t('features.exportData.exportCategories', { count: categoriesCount }) }}</span>
        </label>
      </div>
    </div>

    <Button
      variant="primary"
      full-width
      @click="handleExport"
      :disabled="!canExport || isExporting"
    >
      {{
        isExporting
          ? t('features.exportData.submitting')
          : t('features.exportData.submit')
      }}
    </Button>

    <div v-if="exportSuccess" class="success-message">
      {{ t('features.exportData.success') }}
    </div>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { useExpenses } from '@/entities/expense/model/useExpenses'
import { useCategories } from '@/entities/category/model/useCategories'
import { useI18n } from '@/shared/i18n'

const { expenses } = useExpenses()
const { categories } = useCategories()
const { t } = useI18n()

const exportOptions = ref({
  expenses: true,
  categories: true,
})

const isExporting = ref(false)
const exportSuccess = ref(false)

const expensesCount = computed(() => expenses.value.length)
const categoriesCount = computed(() => categories.value.length)

const canExport = computed(() => {
  return exportOptions.value.expenses || exportOptions.value.categories
})

const handleExport = () => {
  if (!canExport.value) return

  isExporting.value = true
  exportSuccess.value = false

  const data: any = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
  }

  if (exportOptions.value.expenses) {
    data.expenses = expenses.value
  }

  if (exportOptions.value.categories) {
    data.categories = categories.value
  }

  const jsonString = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `moneytrack-export-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)

  isExporting.value = false
  exportSuccess.value = true

  setTimeout(() => {
    exportSuccess.value = false
  }, 3000)
}
</script>

<style scoped src="./ExportData.css"></style>
