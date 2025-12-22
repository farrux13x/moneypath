<template>
  <div class="statistics-page">
    <div class="page-container">
      <header class="page-header">
        <h1 class="page-title">📊 Statistics & Dashboard</h1>
        <p class="page-subtitle">Analyze your spending patterns</p>
      </header>

      <!-- Period Filter -->
      <PeriodFilter @period-change="handlePeriodChange" />

      <!-- Statistics Cards -->
      <div class="statistics-grid">
        <StatisticsCard
          title="Total Spending"
          :value="formatCurrency(filteredTotalAmount)"
          icon="💰"
        />
        <StatisticsCard
          :title="getPeriodTitle()"
          :value="formatCurrency(periodTotal)"
          :subtitle="getPeriodComparison()"
          icon="📅"
        />
        <StatisticsCard
          title="Average Expense"
          :value="formatCurrency(filteredAverageExpense)"
          icon="📈"
        />
        <StatisticsCard
          title="Total Expenses"
          :value="filteredExpenses.length"
          subtitle="items"
          icon="📝"
        />
      </div>

      <!-- Charts Section -->
      <div class="charts-section">
        <!-- Spending by Category - Pie Chart -->
        <Card>
          <h2 class="chart-title">Spending by Category</h2>
          <div class="chart-container">
            <PieChart :data="categoryPieData" :size="250" />
          </div>
        </Card>

        <!-- Spending by Category - Bar Chart -->
        <Card>
          <h2 class="chart-title">Top Categories</h2>
          <div class="chart-container">
            <BarChart :data="categoryBarData" />
          </div>
        </Card>

        <!-- Spending Trend -->
        <Card>
          <h2 class="chart-title">{{ getTrendChartTitle() }}</h2>
          <div class="chart-container">
            <LineChart :data="trendLineData" />
          </div>
        </Card>

        <!-- Period Spending -->
        <Card>
          <h2 class="chart-title">{{ getPeriodChartTitle() }}</h2>
          <div class="chart-container">
            <BarChart :data="periodBarData" />
          </div>
        </Card>
      </div>

      <!-- Top Categories List -->
      <Card>
        <h2 class="chart-title">Top 5 Categories</h2>
        <div class="top-categories-list">
          <div
            v-for="(category, index) in filteredTopCategories"
            :key="category.category"
            class="top-category-item"
          >
            <div class="top-category-rank">#{{ index + 1 }}</div>
            <div class="top-category-info">
              <div class="top-category-name">{{ getCategoryName(category.category) }}</div>
              <div class="top-category-amount">{{ formatCurrency(category.amount) }}</div>
            </div>
            <div
              class="top-category-color"
              :style="{ backgroundColor: getCategoryColor(category.category) }"
            ></div>
          </div>
        </div>
      </Card>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Card } from '@/shared/ui/Card'
import { StatisticsCard } from '@/widgets/statistics-card/ui'
import { PieChart } from '@/shared/ui/PieChart'
import { BarChart } from '@/shared/ui/BarChart'
import { LineChart } from '@/shared/ui/LineChart'
import { PeriodFilter } from '@/features/period-filter/ui'
import { useExpenses } from '@/entities/expense/model/useExpenses'
import { useCategories } from '@/entities/category/model/useCategories'

type Period = 'daily' | 'weekly' | 'monthly' | 'yearly'

const selectedPeriod = ref<Period>('monthly')

const {
  expenses,
  totalAmount,
  expensesByCategory,
  monthlyExpenses,
  weeklyExpenses,
  dailyExpenses,
  yearlyExpenses,
  averageExpense,
  topCategories,
  thisMonthTotal,
  lastMonthTotal,
  getExpensesByPeriod
} = useExpenses()

const { categories, getCategoryById } = useCategories()

const handlePeriodChange = (period: Period) => {
  selectedPeriod.value = period
}

const periodExpenses = computed(() => {
  return getExpensesByPeriod(selectedPeriod.value)
})

const periodTotal = computed(() => {
  const now = new Date()
  switch (selectedPeriod.value) {
    case 'daily':
      const today = now.toISOString().split('T')[0]
      return dailyExpenses.value[today] || 0
    case 'weekly':
      const weekStart = new Date(now)
      weekStart.setDate(now.getDate() - now.getDay())
      const weekKey = weekStart.toISOString().split('T')[0]
      return weeklyExpenses.value[weekKey] || 0
    case 'monthly':
      return thisMonthTotal.value
    case 'yearly':
      const yearKey = now.getFullYear().toString()
      return yearlyExpenses.value[yearKey] || 0
    default:
      return 0
  }
})

const previousPeriodTotal = computed(() => {
  const now = new Date()
  switch (selectedPeriod.value) {
    case 'daily':
      const yesterday = new Date(now)
      yesterday.setDate(now.getDate() - 1)
      const yesterdayKey = yesterday.toISOString().split('T')[0]
      return dailyExpenses.value[yesterdayKey] || 0
    case 'weekly':
      const lastWeekStart = new Date(now)
      lastWeekStart.setDate(now.getDate() - now.getDay() - 7)
      const lastWeekKey = lastWeekStart.toISOString().split('T')[0]
      return weeklyExpenses.value[lastWeekKey] || 0
    case 'monthly':
      return lastMonthTotal.value
    case 'yearly':
      const lastYearKey = (now.getFullYear() - 1).toString()
      return yearlyExpenses.value[lastYearKey] || 0
    default:
      return 0
  }
})

const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`
}

const getCategoryName = (categoryId: string): string => {
  return getCategoryById(categoryId)?.name || 'Unknown'
}

const getCategoryColor = (categoryId: string): string => {
  return getCategoryById(categoryId)?.color || '#6b7280'
}

const getPeriodTitle = (): string => {
  switch (selectedPeriod.value) {
    case 'daily':
      return 'Today'
    case 'weekly':
      return 'This Week'
    case 'monthly':
      return 'This Month'
    case 'yearly':
      return 'This Year'
    default:
      return 'This Month'
  }
}

const getPeriodComparison = (): string => {
  const diff = periodTotal.value - previousPeriodTotal.value
  const periodLabel = selectedPeriod.value === 'daily' ? 'yesterday' 
    : selectedPeriod.value === 'weekly' ? 'last week'
    : selectedPeriod.value === 'monthly' ? 'last month'
    : 'last year'
  
  if (diff > 0) {
    return `↑ ${formatCurrency(diff)} from ${periodLabel}`
  } else if (diff < 0) {
    return `↓ ${formatCurrency(Math.abs(diff))} from ${periodLabel}`
  }
  return `Same as ${periodLabel}`
}

const getTrendChartTitle = (): string => {
  switch (selectedPeriod.value) {
    case 'daily':
      return 'Daily Spending Trend'
    case 'weekly':
      return 'Weekly Spending Trend'
    case 'monthly':
      return 'Monthly Spending Trend'
    case 'yearly':
      return 'Yearly Spending Trend'
    default:
      return 'Spending Trend'
  }
}

const getPeriodChartTitle = (): string => {
  switch (selectedPeriod.value) {
    case 'daily':
      return 'Recent Daily Spending'
    case 'weekly':
      return 'Recent Weekly Spending'
    case 'monthly':
      return 'Recent Monthly Spending'
    case 'yearly':
      return 'Yearly Spending'
    default:
      return 'Recent Spending'
  }
}

const filteredExpenses = computed(() => {
  const now = new Date()
  const periodData = periodExpenses.value
  const periodKeys = Object.keys(periodData)
  
  if (periodKeys.length === 0) return []
  
  return expenses.value.filter(exp => {
    const expDate = new Date(exp.date)
    if (selectedPeriod.value === 'daily') {
      return periodKeys.includes(exp.date)
    } else if (selectedPeriod.value === 'weekly') {
      const weekStart = new Date(expDate)
      weekStart.setDate(expDate.getDate() - expDate.getDay())
      const weekKey = weekStart.toISOString().split('T')[0]
      return periodKeys.includes(weekKey)
    } else if (selectedPeriod.value === 'monthly') {
      const monthKey = `${expDate.getFullYear()}-${String(expDate.getMonth() + 1).padStart(2, '0')}`
      return periodKeys.includes(monthKey)
    } else if (selectedPeriod.value === 'yearly') {
      return periodKeys.includes(expDate.getFullYear().toString())
    }
    return true
  })
})

const filteredExpensesByCategory = computed(() => {
  const grouped: Record<string, number> = {}
  filteredExpenses.value.forEach(exp => {
    grouped[exp.category] = (grouped[exp.category] || 0) + exp.amount
  })
  return grouped
})

const filteredTopCategories = computed(() => {
  const categoryTotals = Object.entries(filteredExpensesByCategory.value)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5)
  return categoryTotals
})

const filteredTotalAmount = computed(() => {
  return filteredExpenses.value.reduce((sum, exp) => sum + exp.amount, 0)
})

const filteredAverageExpense = computed(() => {
  if (filteredExpenses.value.length === 0) return 0
  return filteredTotalAmount.value / filteredExpenses.value.length
})

const categoryPieData = computed(() => {
  return Object.entries(filteredExpensesByCategory.value).map(([category, amount]) => ({
    label: getCategoryName(category),
    value: amount,
    color: getCategoryColor(category)
  }))
})

const categoryBarData = computed(() => {
  return filteredTopCategories.value.map(cat => ({
    label: getCategoryName(cat.category),
    value: cat.amount,
    color: getCategoryColor(cat.category)
  }))
})

const trendLineData = computed(() => {
  const periodData = periodExpenses.value
  const sorted = Object.entries(periodData)
    .sort(([a], [b]) => a.localeCompare(b))
  
  let sliceCount = 6
  if (selectedPeriod.value === 'daily') sliceCount = 7 // Last 7 days
  else if (selectedPeriod.value === 'weekly') sliceCount = 8 // Last 8 weeks
  else if (selectedPeriod.value === 'monthly') sliceCount = 6 // Last 6 months
  else if (selectedPeriod.value === 'yearly') sliceCount = 5 // Last 5 years

  const sliced = sorted.slice(-sliceCount)

  return sliced.map(([key, amount]) => {
    let label = ''
    if (selectedPeriod.value === 'daily') {
      const date = new Date(key)
      label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    } else if (selectedPeriod.value === 'weekly') {
      const date = new Date(key)
      label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    } else if (selectedPeriod.value === 'monthly') {
      const [year, monthNum] = key.split('-')
      const date = new Date(parseInt(year), parseInt(monthNum) - 1, 1)
      label = date.toLocaleDateString('en-US', { month: 'short' })
    } else if (selectedPeriod.value === 'yearly') {
      label = key
    }
    return {
      label,
      value: amount
    }
  })
})

const periodBarData = computed(() => {
  const periodData = periodExpenses.value
  const sorted = Object.entries(periodData)
    .sort(([a], [b]) => a.localeCompare(b))
  
  let sliceCount = 4
  if (selectedPeriod.value === 'daily') sliceCount = 7 // Last 7 days
  else if (selectedPeriod.value === 'weekly') sliceCount = 4 // Last 4 weeks
  else if (selectedPeriod.value === 'monthly') sliceCount = 6 // Last 6 months
  else if (selectedPeriod.value === 'yearly') sliceCount = 5 // Last 5 years

  const sliced = sorted.slice(-sliceCount)

  return sliced.map(([key, amount]) => {
    let label = ''
    if (selectedPeriod.value === 'daily') {
      const date = new Date(key)
      label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    } else if (selectedPeriod.value === 'weekly') {
      const date = new Date(key)
      label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    } else if (selectedPeriod.value === 'monthly') {
      const [year, monthNum] = key.split('-')
      const date = new Date(parseInt(year), parseInt(monthNum) - 1, 1)
      label = date.toLocaleDateString('en-US', { month: 'short' })
    } else if (selectedPeriod.value === 'yearly') {
      label = key
    }
    return {
      label,
      value: amount,
      color: '#6366f1'
    }
  })
})

</script>

<style scoped>
.statistics-page {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.page-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem;
}

@media (min-width: 768px) {
  .page-container {
    padding: 2rem;
  }
}

.page-header {
  text-align: center;
  color: white;
}

.page-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.page-subtitle {
  font-size: 1.25rem;
  opacity: 0.95;
}

.statistics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.charts-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.chart-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

.chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  overflow-x: auto;
}

.top-categories-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.top-category-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: var(--bg-secondary);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}

.top-category-rank {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
  min-width: 40px;
}

.top-category-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.top-category-name {
  font-weight: 500;
  color: var(--text-primary);
}

.top-category-amount {
  font-weight: 700;
  color: var(--text-primary);
  font-size: 1.125rem;
}

.top-category-color {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  border: 2px solid var(--border-color);
  flex-shrink: 0;
}


@media (min-width: 768px) {
  .page-title {
    font-size: 4rem;
  }
}

@media (max-width: 768px) {
  .charts-section {
    grid-template-columns: 1fr;
  }

  .statistics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>

