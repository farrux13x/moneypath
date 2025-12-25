<template>
  <Card>
    <h2 class="section-title">{{ t('features.importData.title') }}</h2>
    <p class="section-description">
      {{ t('features.importData.description') }}
    </p>

    <div class="import-options">
      <div class="import-option">
        <label class="checkbox-label">
          <input
            type="checkbox"
            v-model="importOptions.expenses"
            class="checkbox"
          />
          <span>{{ t('features.importData.importExpenses') }}</span>
        </label>
      </div>

      <div class="import-option">
        <label class="checkbox-label">
          <input
            type="checkbox"
            v-model="importOptions.categories"
            class="checkbox"
          />
          <span>{{ t('features.importData.importCategories') }}</span>
        </label>
      </div>

      <div class="import-option">
        <label class="checkbox-label">
          <input
            type="checkbox"
            v-model="importOptions.replace"
            class="checkbox"
          />
          <span>{{ t('features.importData.replaceExisting') }}</span>
        </label>
      </div>
    </div>

    <div class="file-input-wrapper">
      <input
        ref="fileInput"
        type="file"
        accept=".json,application/json"
        @change="handleFileSelect"
        class="file-input"
        :disabled="isImporting"
      />
      <div v-if="selectedFile" class="selected-file">
        {{ t('features.importData.selectedFile', { name: selectedFile.name }) }}
      </div>
    </div>

    <Button
      variant="primary"
      full-width
      @click="handleImport"
      :disabled="!canImport || isImporting"
    >
      {{
        isImporting
          ? t('features.importData.submitting')
          : t('features.importData.submit')
      }}
    </Button>

    <div v-if="importSuccess" class="success-message">
      {{ t('features.importData.success') }}
    </div>

    <div v-if="importError" class="error-message">{{ t('features.importData.errorPrefix', { message: importError }) }}</div>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { useExpenses } from '@/entities/expense/model/useExpenses'
import { useCategories } from '@/entities/category/model/useCategories'
import type { Expense } from '@/entities/expense/model/types'
import type { Category } from '@/entities/category/model/types'
import { useI18n } from '@/shared/i18n'

const { expenses, importExpense, clearAllExpenses } = useExpenses()
const { categories, importCategory, removeCategory } = useCategories()
const { t } = useI18n()

const importOptions = ref({
  expenses: true,
  categories: true,
  replace: false,
})

const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const isImporting = ref(false)
const importSuccess = ref(false)
const importError = ref('')

const canImport = computed(() => {
  return (
    selectedFile.value !== null &&
    (importOptions.value.expenses || importOptions.value.categories)
  )
})

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    selectedFile.value = file
    importError.value = ''
    importSuccess.value = false
  }
}

const validateExpense = (expense: any): expense is Expense => {
  return (
    typeof expense === 'object' &&
    typeof expense.id === 'string' &&
    typeof expense.amount === 'number' &&
    expense.amount > 0 &&
    typeof expense.description === 'string' &&
    typeof expense.category === 'string' &&
    typeof expense.date === 'string'
  )
}

const validateCategory = (category: any): category is Category => {
  return (
    typeof category === 'object' &&
    typeof category.id === 'string' &&
    typeof category.name === 'string' &&
    typeof category.color === 'string' &&
    /^#[0-9A-F]{6}$/i.test(category.color)
  )
}

const handleImport = async () => {
  if (!selectedFile.value || !canImport.value) return

  isImporting.value = true
  importError.value = ''
  importSuccess.value = false

  try {
    const text = await selectedFile.value.text()
    const data = JSON.parse(text)

    // Validate data structure
    if (!data || typeof data !== 'object') {
      throw new Error(t('features.importData.errors.invalidFile'))
    }

    let importedExpenses = 0
    let importedCategories = 0
    let errors: string[] = []

    // Import expenses
    if (importOptions.value.expenses && data.expenses) {
      if (!Array.isArray(data.expenses)) {
        errors.push(t('features.importData.errors.expensesArray'))
      } else {
        if (importOptions.value.replace) {
          // Remove all existing expenses
          clearAllExpenses()
        }

        data.expenses.forEach((expense: any, index: number) => {
          if (validateExpense(expense)) {
            // Check if expense already exists (if not replacing)
            if (!importOptions.value.replace) {
              const exists = expenses.value.some((e) => e.id === expense.id)
              if (exists) {
                return // Skip duplicate
              }
            }
            importExpense(expense)
            importedExpenses++
          } else {
            errors.push(t('features.importData.errors.invalidExpenseAtIndex', { index }))
          }
        })
      }
    }

    // Import categories
    if (importOptions.value.categories && data.categories) {
      if (!Array.isArray(data.categories)) {
        errors.push(t('features.importData.errors.categoriesArray'))
      } else {
        if (importOptions.value.replace) {
          // Remove all non-default categories
          const defaultIds = [
            'food',
            'transport',
            'shopping',
            'bills',
            'entertainment',
            'health',
            'education',
            'other',
          ]
          categories.value.forEach((cat) => {
            if (!defaultIds.includes(cat.id)) {
              removeCategory(cat.id)
            }
          })
        }

        data.categories.forEach((category: any, index: number) => {
          if (validateCategory(category)) {
            // Check if category already exists (if not replacing)
            if (!importOptions.value.replace) {
              const exists = categories.value.some((c) => c.id === category.id)
              if (exists) {
                return // Skip duplicate
              }
            }
            importCategory(category)
            importedCategories++
          } else {
            errors.push(t('features.importData.errors.invalidCategoryAtIndex', { index }))
          }
        })
      }
    }

    if (errors.length > 0) {
      importError.value = t('features.importData.errors.completedWithErrors', { errors: errors.join(', ') })
    } else {
      importSuccess.value = true
      importError.value = ''
    }

    // Reset file input
    if (fileInput.value) {
      fileInput.value.value = ''
    }
    selectedFile.value = null

    setTimeout(() => {
      importSuccess.value = false
      importError.value = ''
    }, 5000)
  } catch (error) {
    importError.value =
      error instanceof Error ? error.message : t('features.importData.errors.failed')
    importSuccess.value = false
  } finally {
    isImporting.value = false
  }
}
</script>

<style scoped src="./ImportData.css"></style>
