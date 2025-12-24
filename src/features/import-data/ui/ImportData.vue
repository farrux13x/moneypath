<template>
  <Card>
    <h2 :class="$style['section-title']">Import Data</h2>
    <p :class="$style['section-description']">
      Restore your expenses and categories from a JSON file
    </p>

    <div :class="$style['import-options']">
      <div :class="$style['import-option']">
        <label :class="$style['checkbox-label']">
          <input
            type="checkbox"
            v-model="importOptions.expenses"
            :class="$style['checkbox']"
          />
          <span>Import Expenses</span>
        </label>
      </div>

      <div :class="$style['import-option']">
        <label :class="$style['checkbox-label']">
          <input
            type="checkbox"
            v-model="importOptions.categories"
            :class="$style['checkbox']"
          />
          <span>Import Categories</span>
        </label>
      </div>

      <div :class="$style['import-option']">
        <label :class="$style['checkbox-label']">
          <input
            type="checkbox"
            v-model="importOptions.replace"
            :class="$style['checkbox']"
          />
          <span>Replace existing data (otherwise merge)</span>
        </label>
      </div>
    </div>

    <div :class="$style['file-input-wrapper']">
      <input
        ref="fileInput"
        type="file"
        accept=".json,application/json"
        @change="handleFileSelect"
        :class="$style['file-input']"
        :disabled="isImporting"
      />
      <div v-if="selectedFile" :class="$style['selected-file']">
        📄 {{ selectedFile.name }}
      </div>
    </div>

    <Button
      variant="primary"
      full-width
      @click="handleImport"
      :disabled="!canImport || isImporting"
    >
      {{ isImporting ? 'Importing...' : '📤 Import Data' }}
    </Button>

    <div v-if="importSuccess" :class="$style['success-message']">
      ✅ Data imported successfully!
    </div>

    <div v-if="importError" :class="$style['error-message']">❌ {{ importError }}</div>
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

const { expenses, importExpense, clearAllExpenses } = useExpenses()
const { categories, importCategory, removeCategory } = useCategories()

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
      throw new Error('Invalid file format')
    }

    let importedExpenses = 0
    let importedCategories = 0
    let errors: string[] = []

    // Import expenses
    if (importOptions.value.expenses && data.expenses) {
      if (!Array.isArray(data.expenses)) {
        errors.push('Expenses must be an array')
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
            errors.push(`Invalid expense at index ${index}`)
          }
        })
      }
    }

    // Import categories
    if (importOptions.value.categories && data.categories) {
      if (!Array.isArray(data.categories)) {
        errors.push('Categories must be an array')
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
            errors.push(`Invalid category at index ${index}`)
          }
        })
      }
    }

    if (errors.length > 0) {
      importError.value = `Import completed with errors: ${errors.join(', ')}`
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
      error instanceof Error ? error.message : 'Failed to import data'
    importSuccess.value = false
  } finally {
    isImporting.value = false
  }
}
</script>

<style module src="./ImportData.module.css"></style>
