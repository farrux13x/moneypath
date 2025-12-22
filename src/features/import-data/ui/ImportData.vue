<template>
  <Card>
    <h2 class="section-title">Import Data</h2>
    <p class="section-description">Restore your expenses and categories from a JSON file</p>
    
    <div class="import-options">
      <div class="import-option">
        <label class="checkbox-label">
          <input
            type="checkbox"
            v-model="importOptions.expenses"
            class="checkbox"
          />
          <span>Import Expenses</span>
        </label>
      </div>
      
      <div class="import-option">
        <label class="checkbox-label">
          <input
            type="checkbox"
            v-model="importOptions.categories"
            class="checkbox"
          />
          <span>Import Categories</span>
        </label>
      </div>

      <div class="import-option">
        <label class="checkbox-label">
          <input
            type="checkbox"
            v-model="importOptions.replace"
            class="checkbox"
          />
          <span>Replace existing data (otherwise merge)</span>
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

    <div v-if="importSuccess" class="success-message">
      ✅ Data imported successfully!
    </div>

    <div v-if="importError" class="error-message">
      ❌ {{ importError }}
    </div>
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
  replace: false
})

const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const isImporting = ref(false)
const importSuccess = ref(false)
const importError = ref('')

const canImport = computed(() => {
  return selectedFile.value !== null && (importOptions.value.expenses || importOptions.value.categories)
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
              const exists = expenses.value.some(e => e.id === expense.id)
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
          const defaultIds = ['food', 'transport', 'shopping', 'bills', 'entertainment', 'health', 'education', 'other']
          categories.value.forEach(cat => {
            if (!defaultIds.includes(cat.id)) {
              removeCategory(cat.id)
            }
          })
        }

        data.categories.forEach((category: any, index: number) => {
          if (validateCategory(category)) {
            // Check if category already exists (if not replacing)
            if (!importOptions.value.replace) {
              const exists = categories.value.some(c => c.id === category.id)
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
    importError.value = error instanceof Error ? error.message : 'Failed to import data'
    importSuccess.value = false
  } finally {
    isImporting.value = false
  }
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

.import-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.import-option {
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

.file-input-wrapper {
  margin-bottom: 1.5rem;
}

.file-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px dashed var(--border-color);
  border-radius: var(--radius-md);
  background-color: var(--bg-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.file-input:hover:not(:disabled) {
  border-color: var(--primary-color);
  background-color: var(--bg-tertiary);
}

.file-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.selected-file {
  margin-top: 0.75rem;
  padding: 0.75rem;
  background-color: var(--bg-secondary);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  color: var(--text-primary);
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

.error-message {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #fee2e2;
  color: #991b1b;
  border-radius: var(--radius-md);
  text-align: center;
  font-size: 0.875rem;
}
</style>

