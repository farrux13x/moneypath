<template>
  <Card>
    <div class="expense-list-header">
      <h2 class="expense-list-title">Recent Expenses</h2>
      <div class="total-amount">
        <span class="total-label">Total:</span>
        <span class="total-value">${{ totalAmount.toFixed(2) }}</span>
      </div>
    </div>

    <div v-if="expenses.length === 0" class="empty-state">
      <p>No expenses yet. Add your first expense above!</p>
    </div>

    <div v-else class="expense-list">
      <div
        v-for="expense in sortedExpenses"
        :key="expense.id"
        class="expense-item"
      >
        <div class="expense-item-content">
          <div
            class="expense-category-badge"
            :style="{ backgroundColor: getCategoryColor(expense.category) }"
          >
            {{ getCategoryName(expense.category) }}
          </div>
          <div class="expense-details">
            <p class="expense-description">
              {{ expense.description || 'No description' }}
            </p>
            <p class="expense-date">{{ formatDate(expense.date) }}</p>
          </div>
          <div class="expense-amount">${{ expense.amount.toFixed(2) }}</div>
        </div>
        <Button variant="danger" size="sm" @click="handleRemove(expense.id)">
          Remove
        </Button>
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

const { expenses, totalAmount, removeExpense } = useExpenses()
const { getCategoryById } = useCategories()

const sortedExpenses = computed(() => {
  return [...expenses.value].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
})

const getCategoryName = (categoryId: string): string => {
  return getCategoryById(categoryId)?.name || 'Other'
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

const handleRemove = (id: string) => {
  if (confirm('Are you sure you want to remove this expense?')) {
    removeExpense(id)
  }
}
</script>

<style scoped>
.expense-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.expense-list-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
}

.total-amount {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.total-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.total-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-secondary);
}

.expense-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.expense-item {
  padding: 1rem;
  background-color: var(--bg-secondary);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  transition: all 0.2s ease;
}

.expense-item:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.expense-item-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
}

.expense-category-badge {
  padding: 0.375rem 0.75rem;
  border-radius: var(--radius-sm);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

.expense-details {
  flex: 1;
  min-width: 200px;
}

.expense-description {
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.expense-date {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.expense-amount {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
}

@media (max-width: 640px) {
  .expense-item-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .expense-amount {
    align-self: flex-end;
  }
}
</style>
