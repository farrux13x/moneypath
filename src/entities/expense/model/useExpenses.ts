import { ref, computed } from 'vue'
import type { Expense } from './types'

const expenses = ref<Expense[]>([])

export function useExpenses() {
  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    }
    expenses.value.push(newExpense)
    // Save to localStorage
    localStorage.setItem('expenses', JSON.stringify(expenses.value))
  }

  const removeExpense = (id: string) => {
    expenses.value = expenses.value.filter((exp) => exp.id !== id)
    localStorage.setItem('expenses', JSON.stringify(expenses.value))
  }

  const importExpense = (expense: Expense) => {
    // Check if expense with this ID already exists
    const existingIndex = expenses.value.findIndex(
      (exp) => exp.id === expense.id,
    )
    if (existingIndex !== -1) {
      expenses.value[existingIndex] = expense
    } else {
      expenses.value.push(expense)
    }
    localStorage.setItem('expenses', JSON.stringify(expenses.value))
  }

  const clearAllExpenses = () => {
    expenses.value = []
    localStorage.setItem('expenses', JSON.stringify(expenses.value))
  }

  const totalAmount = computed(() => {
    return expenses.value.reduce((sum, exp) => sum + exp.amount, 0)
  })

  const expensesByCategory = computed(() => {
    const grouped: Record<string, number> = {}
    expenses.value.forEach((exp) => {
      grouped[exp.category] = (grouped[exp.category] || 0) + exp.amount
    })
    return grouped
  })

  const expensesByDate = computed(() => {
    const grouped: Record<string, number> = {}
    expenses.value.forEach((exp) => {
      const date = exp.date
      grouped[date] = (grouped[date] || 0) + exp.amount
    })
    return grouped
  })

  const monthlyExpenses = computed(() => {
    const grouped: Record<string, number> = {}
    expenses.value.forEach((exp) => {
      const date = new Date(exp.date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      grouped[monthKey] = (grouped[monthKey] || 0) + exp.amount
    })
    return grouped
  })

  const weeklyExpenses = computed(() => {
    const grouped: Record<string, number> = {}
    expenses.value.forEach((exp) => {
      const date = new Date(exp.date)
      const weekStart = new Date(date)
      weekStart.setDate(date.getDate() - date.getDay())
      const weekKey = weekStart.toISOString().split('T')[0]
      grouped[weekKey] = (grouped[weekKey] || 0) + exp.amount
    })
    return grouped
  })

  const averageExpense = computed(() => {
    if (expenses.value.length === 0) return 0
    return totalAmount.value / expenses.value.length
  })

  const topCategories = computed(() => {
    const categoryTotals = Object.entries(expensesByCategory.value)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)
    return categoryTotals
  })

  const thisMonthTotal = computed(() => {
    const now = new Date()
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    return monthlyExpenses.value[currentMonth] || 0
  })

  const lastMonthTotal = computed(() => {
    const now = new Date()
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastMonthKey = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}`
    return monthlyExpenses.value[lastMonthKey] || 0
  })

  const dailyExpenses = computed(() => {
    const grouped: Record<string, number> = {}
    expenses.value.forEach((exp) => {
      const date = exp.date
      grouped[date] = (grouped[date] || 0) + exp.amount
    })
    return grouped
  })

  const yearlyExpenses = computed(() => {
    const grouped: Record<string, number> = {}
    expenses.value.forEach((exp) => {
      const date = new Date(exp.date)
      const yearKey = date.getFullYear().toString()
      grouped[yearKey] = (grouped[yearKey] || 0) + exp.amount
    })
    return grouped
  })

  const getExpensesByPeriod = (
    period: 'daily' | 'weekly' | 'monthly' | 'yearly',
  ) => {
    switch (period) {
      case 'daily':
        return dailyExpenses.value
      case 'weekly':
        return weeklyExpenses.value
      case 'monthly':
        return monthlyExpenses.value
      case 'yearly':
        return yearlyExpenses.value
      default:
        return monthlyExpenses.value
    }
  }

  // Load from localStorage on initialization
  const loadExpenses = () => {
    const stored = localStorage.getItem('expenses')
    if (stored) {
      try {
        expenses.value = JSON.parse(stored)
      } catch (e) {
        console.error('Failed to load expenses from localStorage', e)
      }
    }
  }

  // Initialize
  loadExpenses()

  return {
    expenses: computed(() => expenses.value),
    addExpense,
    removeExpense,
    importExpense,
    clearAllExpenses,
    totalAmount,
    expensesByCategory,
    expensesByDate,
    monthlyExpenses,
    weeklyExpenses,
    dailyExpenses,
    yearlyExpenses,
    averageExpense,
    topCategories,
    thisMonthTotal,
    lastMonthTotal,
    getExpensesByPeriod,
  }
}
