<template>
  <div :class="$style['mobile-expense-list']">
    <div v-if="expenses.length === 0" :class="$style['empty-state']">
      <p>No expenses yet. Tap the + button to add your first expense!</p>
    </div>

    <div v-else>
      <div
        v-for="(group, date) in groupedExpenses"
        :key="date"
        :class="$style['expense-group']"
      >
        <div :class="$style['group-header']">
          <h3 :class="$style['group-date']">{{ formatDateHeader(date) }}</h3>
          <span :class="$style['group-total']"
            >${{ getGroupTotal(group).toFixed(2) }}</span
          >
        </div>

        <div :class="$style['expense-items']">
          <div
            v-for="expense in group"
            :key="expense.id"
            :class="$style['expense-item']"
            @click="handleExpenseClick(expense)"
          >
            <div
              :class="$style['expense-indicator']"
              :style="{ backgroundColor: getCategoryColor(expense.category) }"
            ></div>
            <div :class="$style['expense-content']">
              <div :class="$style['expense-main']">
                <div :class="$style['expense-info']">
                  <h4 :class="$style['expense-title']">
                    {{ expense.description || 'No description' }}
                  </h4>
                  <div :class="$style['expense-meta']">
                    <span :class="$style['expense-category']">{{
                      getCategoryName(expense.category)
                    }}</span>
                    <span :class="$style['expense-time']">{{
                      formatTime(expense.date)
                    }}</span>
                  </div>
                </div>
                <div :class="$style['expense-amount']">
                  -${{ expense.amount.toFixed(2) }}
                </div>
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
const { getCategoryById } = useCategories()

const emit = defineEmits<{
  expenseClick: [expense: Expense]
}>()

const groupedExpenses = computed(() => {
  const groups: Record<string, Expense[]> = {}

  expenses.value.forEach((expense) => {
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
  sortedDates.forEach((date) => {
    groups[date].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
  })

  const result: Record<string, Expense[]> = {}
  sortedDates.forEach((date) => {
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
      year: 'numeric',
    })
  }
}

const formatTime = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

const getGroupTotal = (group: Expense[]): number => {
  return group.reduce((sum, exp) => sum + exp.amount, 0)
}

const handleExpenseClick = (expense: Expense) => {
  emit('expenseClick', expense)
}
</script>

<style module src="./MobileExpenseList.module.css"></style>
