<template>
  <Card>
    <h2 class="section-title">Export Data</h2>
    <p class="section-description">Download your expenses and categories as a JSON file</p>
    
    <div class="export-options">
      <div class="export-option">
        <label class="checkbox-label">
          <input
            type="checkbox"
            v-model="exportOptions.expenses"
            class="checkbox"
          />
          <span>Export Expenses ({{ expensesCount }} items)</span>
        </label>
      </div>
      
      <div class="export-option">
        <label class="checkbox-label">
          <input
            type="checkbox"
            v-model="exportOptions.categories"
            class="checkbox"
          />
          <span>Export Categories ({{ categoriesCount }} items)</span>
        </label>
      </div>
    </div>

    <Button
      variant="primary"
      full-width
      @click="handleExport"
      :disabled="!canExport || isExporting"
    >
      {{ isExporting ? 'Exporting...' : '📥 Export Data' }}
    </Button>

    <div v-if="exportSuccess" class="success-message">
      ✅ Data exported successfully!
    </div>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { useExpenses } from '@/entities/expense/model/useExpenses'
import { useCategories } from '@/entities/category/model/useCategories'

const { expenses } = useExpenses()
const { categories } = useCategories()

const exportOptions = ref({
  expenses: true,
  categories: true
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
    exportedAt: new Date().toISOString()
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

<style scoped>
.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.section-description {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

.export-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.export-option {
  padding: 1rem;
  background-color: var(--bg-secondary);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--text-primary);
}

.checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: var(--primary-color);
}

.success-message {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #d1fae5;
  color: #065f46;
  border-radius: var(--radius-md);
  text-align: center;
  font-size: 0.875rem;
}
</style>


