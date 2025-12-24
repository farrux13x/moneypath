<template>
  <Card>
    <div class="search-results-header">
      <h2 class="results-title">Search Results</h2>
      <div v-if="results.length === 0" class="no-results">
        <p>No expenses found matching your search criteria.</p>
        <p class="no-results-hint">
          Try adjusting your filters or search query.
        </p>
      </div>
    </div>

    <div v-if="results.length > 0" class="results-list">
      <div v-for="expense in results" :key="expense.id" class="result-item">
        <div class="result-item-content">
          <div
            class="result-category-badge"
            :style="{ backgroundColor: getCategoryColor(expense.category) }"
          >
            {{ getCategoryName(expense.category) }}
          </div>
          <div class="result-details">
            <p class="result-description">
              {{ expense.description || 'No description' }}
            </p>
            <p class="result-date">{{ formatDate(expense.date) }}</p>
          </div>
          <div class="result-amount">${{ expense.amount.toFixed(2) }}</div>
        </div>
        <Button variant="danger" size="sm" @click="handleRemove(expense.id)">
          Remove
        </Button>
      </div>
    </div>

    <div v-if="results.length > 0" class="results-summary">
      <div class="summary-item">
        <span class="summary-label">Total Amount:</span>
        <span class="summary-value">${{ totalAmount.toFixed(2) }}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">Average:</span>
        <span class="summary-value">${{ averageAmount.toFixed(2) }}</span>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { useExpenses } from '@/entities/expense/model/useExpenses'
import { useCategories } from '@/entities/category/model/useCategories'
import type { Expense } from '@/entities/expense/model/types'

interface Props {
  results: Expense[]
}

const props = defineProps<Props>()

const { removeExpense } = useExpenses()
const { getCategoryById } = useCategories()

const getCategoryName = (categoryId: string): string => {
  return getCategoryById(categoryId)?.name || 'Unknown'
}

const getCategoryColor = (categoryId: string): string => {
  return getCategoryById(categoryId)?.color || '#6b7280'
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const totalAmount = computed(() => {
  return props.results.reduce((sum, exp) => sum + exp.amount, 0)
})

const averageAmount = computed(() => {
  if (props.results.length === 0) return 0
  return totalAmount.value / props.results.length
})

const handleRemove = (id: string) => {
  if (confirm('Are you sure you want to remove this expense?')) {
    removeExpense(id)
  }
}
</script>

<style scoped src="./SearchResults.css"></style>
