import { ref, computed } from 'vue'
import { useExpenses } from '@/entities/expense/model/useExpenses'
import { useCategories } from '@/entities/category/model/useCategories'
import { useI18n } from '@/shared/i18n'

type Period = 'daily' | 'weekly' | 'monthly' | 'yearly'

export function useStatisticsPage() {
  const { t } = useI18n()

  const selectedPeriod = ref<Period>('monthly')

  const {
    expenses,
    weeklyExpenses,
    dailyExpenses,
    yearlyExpenses,
    thisMonthTotal,
    lastMonthTotal,
    getExpensesByPeriod,
  } = useExpenses()

  const { getCategoryById } = useCategories()

  const handlePeriodChange = (period: Period) => {
    selectedPeriod.value = period
  }

  const periodExpenses = computed(() => {
    return getExpensesByPeriod(selectedPeriod.value)
  })

  const periodTotal = computed(() => {
    const now = new Date()
    switch (selectedPeriod.value) {
      case 'daily': {
        const today = now.toISOString().split('T')[0]
        return dailyExpenses.value[today] || 0
      }
      case 'weekly': {
        const weekStart = new Date(now)
        weekStart.setDate(now.getDate() - now.getDay())
        const weekKey = weekStart.toISOString().split('T')[0]
        return weeklyExpenses.value[weekKey] || 0
      }
      case 'monthly':
        return thisMonthTotal.value
      case 'yearly': {
        const yearKey = now.getFullYear().toString()
        return yearlyExpenses.value[yearKey] || 0
      }
      default:
        return 0
    }
  })

  const previousPeriodTotal = computed(() => {
    const now = new Date()
    switch (selectedPeriod.value) {
      case 'daily': {
        const yesterday = new Date(now)
        yesterday.setDate(now.getDate() - 1)
        const yesterdayKey = yesterday.toISOString().split('T')[0]
        return dailyExpenses.value[yesterdayKey] || 0
      }
      case 'weekly': {
        const lastWeekStart = new Date(now)
        lastWeekStart.setDate(now.getDate() - now.getDay() - 7)
        const lastWeekKey = lastWeekStart.toISOString().split('T')[0]
        return weeklyExpenses.value[lastWeekKey] || 0
      }
      case 'monthly':
        return lastMonthTotal.value
      case 'yearly': {
        const lastYearKey = (now.getFullYear() - 1).toString()
        return yearlyExpenses.value[lastYearKey] || 0
      }
      default:
        return 0
    }
  })

  const formatCurrency = (amount: number): string => {
    return `$${amount.toFixed(2)}`
  }

  const getCategoryName = (categoryId: string): string => {
    return getCategoryById(categoryId)?.name || t('common.unknown')
  }

  const getCategoryColor = (categoryId: string): string => {
    return getCategoryById(categoryId)?.color || '#7a8b8f'
  }

  const getPeriodTitle = (): string => {
    switch (selectedPeriod.value) {
      case 'daily':
        return t('statistics.periodTitle.daily')
      case 'weekly':
        return t('statistics.periodTitle.weekly')
      case 'monthly':
        return t('statistics.periodTitle.monthly')
      case 'yearly':
        return t('statistics.periodTitle.yearly')
      default:
        return t('statistics.periodTitle.monthly')
    }
  }

  const getPeriodComparison = (): string => {
    const diff = periodTotal.value - previousPeriodTotal.value
    const periodLabel =
      selectedPeriod.value === 'daily'
        ? t('statistics.periodLabel.yesterday')
        : selectedPeriod.value === 'weekly'
          ? t('statistics.periodLabel.lastWeek')
          : selectedPeriod.value === 'monthly'
            ? t('statistics.periodLabel.lastMonth')
            : t('statistics.periodLabel.lastYear')

    if (diff > 0) {
      return t('statistics.comparison.more', {
        value: formatCurrency(diff),
        period: periodLabel,
      })
    } else if (diff < 0) {
      return t('statistics.comparison.less', {
        value: formatCurrency(Math.abs(diff)),
        period: periodLabel,
      })
    }
    return t('statistics.comparison.same', { period: periodLabel })
  }

  const getTrendChartTitle = (): string => {
    switch (selectedPeriod.value) {
      case 'daily':
        return t('statistics.trendChart.daily')
      case 'weekly':
        return t('statistics.trendChart.weekly')
      case 'monthly':
        return t('statistics.trendChart.monthly')
      case 'yearly':
        return t('statistics.trendChart.yearly')
      default:
        return t('statistics.trendChart.default')
    }
  }

  const getPeriodChartTitle = (): string => {
    switch (selectedPeriod.value) {
      case 'daily':
        return t('statistics.periodChart.daily')
      case 'weekly':
        return t('statistics.periodChart.weekly')
      case 'monthly':
        return t('statistics.periodChart.monthly')
      case 'yearly':
        return t('statistics.periodChart.yearly')
      default:
        return t('statistics.periodChart.default')
    }
  }

  const filteredExpenses = computed(() => {
    const periodData = periodExpenses.value
    const periodKeys = Object.keys(periodData)

    if (periodKeys.length === 0) return []

    return expenses.value.filter((exp) => {
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
    filteredExpenses.value.forEach((exp) => {
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
    return Object.entries(filteredExpensesByCategory.value).map(
      ([category, amount]) => ({
        label: getCategoryName(category),
        value: amount,
        color: getCategoryColor(category),
      }),
    )
  })

  const categoryBarData = computed(() => {
    return filteredTopCategories.value.map((cat) => ({
      label: getCategoryName(cat.category),
      value: cat.amount,
      color: getCategoryColor(cat.category),
    }))
  })

  const trendLineData = computed(() => {
    const periodData = periodExpenses.value
    const sorted = Object.entries(periodData).sort(([a], [b]) =>
      a.localeCompare(b),
    )

    let sliceCount = 6
    if (selectedPeriod.value === 'daily')
      sliceCount = 7 // Last 7 days
    else if (selectedPeriod.value === 'weekly')
      sliceCount = 8 // Last 8 weeks
    else if (selectedPeriod.value === 'monthly')
      sliceCount = 6 // Last 6 months
    else if (selectedPeriod.value === 'yearly') sliceCount = 5 // Last 5 years

    const sliced = sorted.slice(-sliceCount)

    return sliced.map(([key, amount]) => {
      let label = ''
      if (selectedPeriod.value === 'daily') {
        const date = new Date(key)
        label = date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })
      } else if (selectedPeriod.value === 'weekly') {
        const date = new Date(key)
        label = date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })
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
      }
    })
  })

  const periodBarData = computed(() => {
    const periodData = periodExpenses.value
    const sorted = Object.entries(periodData).sort(([a], [b]) =>
      a.localeCompare(b),
    )

    let sliceCount = 4
    if (selectedPeriod.value === 'daily')
      sliceCount = 7 // Last 7 days
    else if (selectedPeriod.value === 'weekly')
      sliceCount = 4 // Last 4 weeks
    else if (selectedPeriod.value === 'monthly')
      sliceCount = 6 // Last 6 months
    else if (selectedPeriod.value === 'yearly') sliceCount = 5 // Last 5 years

    const sliced = sorted.slice(-sliceCount)

    return sliced.map(([key, amount]) => {
      let label = ''
      if (selectedPeriod.value === 'daily') {
        const date = new Date(key)
        label = date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })
      } else if (selectedPeriod.value === 'weekly') {
        const date = new Date(key)
        label = date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })
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
        color: '#2f7f7b',
      }
    })
  })

  return {
    t,
    handlePeriodChange,
    formatCurrency,
    getCategoryName,
    getCategoryColor,
    getPeriodTitle,
    getPeriodComparison,
    getTrendChartTitle,
    getPeriodChartTitle,
    filteredTotalAmount,
    periodTotal,
    filteredAverageExpense,
    filteredExpenses,
    categoryPieData,
    categoryBarData,
    trendLineData,
    periodBarData,
    filteredTopCategories,
  }
}
