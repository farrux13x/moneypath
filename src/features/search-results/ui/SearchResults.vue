<template>
  <Card>
    <div class="search-results-header">
      <h2 class="results-title">Search Results</h2>
      <div v-if="results.length === 0" class="no-results">
        <p>No expenses found matching your search criteria.</p>
        <p class="no-results-hint">Try adjusting your filters or search query.</p>
      </div>
    </div>

    <div v-if="results.length > 0" class="results-list">
      <div
        v-for="expense in results"
        :key="expense.id"
        class="result-item"
      >
        <div class="result-item-content">
          <div
            class="result-category-badge"
            :style="{ backgroundColor: getCategoryColor(expense.category) }"
          >
            {{ getCategoryName(expense.category) }}
          </div>
          <div class="result-details">
            <p class="result-description">{{ expense.description || 'No description' }}</p>
            <p class="result-date">{{ formatDate(expense.date) }}</p>
          </div>
          <div class="result-amount">${{ expense.amount.toFixed(2) }}</div>
        </div>
        <Button
          variant="danger"
          size="sm"
          @click="handleRemove(expense.id)"
        >
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
const { categories, getCategoryById } = useCategories()

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
    day: 'numeric'
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

<style scoped>
.search-results-header {
  margin-bottom: 1.5rem;
}

.results-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.no-results {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-secondary);
}

.no-results-hint {
  font-size: 0.875rem;
  margin-top: 0.5rem;
  opacity: 0.8;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.result-item {
  padding: 1rem;
  background-color: var(--bg-secondary);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  transition: all 0.2s ease;
}

.result-item:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.result-item-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
}

.result-category-badge {
  padding: 0.375rem 0.75rem;
  border-radius: var(--radius-sm);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

.result-details {
  flex: 1;
  min-width: 200px;
}

.result-description {
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.result-date {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.result-amount {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
}

.results-summary {
  display: flex;
  justify-content: space-around;
  padding: 1.25rem;
  background-color: var(--bg-secondary);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  gap: 1rem;
  flex-wrap: wrap;
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.summary-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.summary-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
}

@media (max-width: 640px) {
  .result-item-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .result-amount {
    align-self: flex-end;
  }
}
</style>


