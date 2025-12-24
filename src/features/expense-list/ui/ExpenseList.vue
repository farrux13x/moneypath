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

<style scoped src="./ExpenseList.css"></style>
