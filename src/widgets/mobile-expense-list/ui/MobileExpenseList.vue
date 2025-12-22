<template>
  <div class="mobile-expense-list">
    <div v-if="expenses.length === 0" class="empty-state">
      <p>No expenses yet. Tap the + button to add your first expense!</p>
    </div>

    <div v-else>
      <div
        v-for="(group, date) in groupedExpenses"
        :key="date"
        class="expense-group"
      >
        <div class="group-header">
          <h3 class="group-date">{{ formatDateHeader(date) }}</h3>
          <span class="group-total">${{ getGroupTotal(group).toFixed(2) }}</span>
        </div>

        <div class="expense-items">
          <div
            v-for="expense in group"
            :key="expense.id"
            class="expense-item"
            @click="handleExpenseClick(expense)"
          >
            <div
              class="expense-indicator"
              :style="{ backgroundColor: getCategoryColor(expense.category) }"
            ></div>
            <div class="expense-content">
              <div class="expense-main">
                <div class="expense-info">
                  <h4 class="expense-title">{{ expense.description || 'No description' }}</h4>
                  <div class="expense-meta">
                    <span class="expense-category">{{ getCategoryName(expense.category) }}</span>
                    <span class="expense-time">{{ formatTime(expense.date) }}</span>
                  </div>
                </div>
                <div class="expense-amount">-${{ expense.amount.toFixed(2) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useExpenses } from '@/entities/expense/model/useExpenses'
import { useCategories } from '@/entities/category/model/useCategories'
import type { Expense } from '@/entities/expense/model/types'

const { expenses } = useExpenses()
const { categories, getCategoryById } = useCategories()

const emit = defineEmits<{
  expenseClick: [expense: Expense]
}>()

const groupedExpenses = computed(() => {
  const groups: Record<string, Expense[]> = {}
  
  expenses.value.forEach(expense => {
    const date = expense.date
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(expense)
  })

  // Sort dates descending
  const sortedDates = Object.keys(groups).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime()
  })

  // Sort expenses within each group by time (newest first)
  sortedDates.forEach(date => {
    groups[date].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
  })

  const result: Record<string, Expense[]> = {}
  sortedDates.forEach(date => {
    result[date] = groups[date]
  })

  return result
})

const getCategoryName = (categoryId: string): string => {
  return getCategoryById(categoryId)?.name || 'Unknown'
}

const getCategoryColor = (categoryId: string): string => {
  return getCategoryById(categoryId)?.color || '#6b7280'
}

const formatDateHeader = (dateString: string): string => {
  const date = new Date(dateString)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === today.toDateString()) {
    return 'Today'
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday'
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }
}

const formatTime = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

const getGroupTotal = (group: Expense[]): number => {
  return group.reduce((sum, exp) => sum + exp.amount, 0)
}

const handleExpenseClick = (expense: Expense) => {
  emit('expenseClick', expense)
}
</script>

<style scoped>
.mobile-expense-list {
  padding-bottom: 5rem;
}

.empty-state {
  text-align: center;
  padding: 3rem 1.5rem;
  color: var(--text-secondary);
}

.expense-group {
  margin-bottom: 2rem;
}

.group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem 0.75rem 1rem;
  margin-bottom: 0.5rem;
}

.group-date {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.group-total {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

.expense-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.expense-item {
  display: flex;
  align-items: center;
  background-color: var(--bg-primary);
  border-radius: var(--radius-md);
  margin: 0 1rem;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid var(--border-color);
}

.expense-item:active {
  background-color: var(--bg-secondary);
  transform: scale(0.98);
}

.expense-indicator {
  width: 4px;
  height: 100%;
  min-height: 48px;
  border-radius: 2px;
  margin-right: 1rem;
  flex-shrink: 0;
}

.expense-content {
  flex: 1;
  min-width: 0;
}

.expense-main {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.expense-info {
  flex: 1;
  min-width: 0;
}

.expense-title {
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.expense-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.expense-category {
  font-weight: 500;
}

.expense-time {
  opacity: 0.8;
}

.expense-amount {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--danger-color);
  flex-shrink: 0;
}

@media (min-width: 768px) {
  .mobile-expense-list {
    display: none;
  }
}
</style>


