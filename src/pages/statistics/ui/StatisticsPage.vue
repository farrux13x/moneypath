<template>
  <div class="statistics-page">
    <div class="page-container">
      <header class="page-header">
        <h1 class="page-title">{{ t('statistics.title') }}</h1>
        <p class="page-subtitle">{{ t('statistics.subtitle') }}</p>
      </header>

      <!-- Period Filter -->
      <PeriodFilter @period-change="handlePeriodChange" />

      <!-- Statistics Cards -->
      <div class="statistics-grid">
        <StatisticsCard
          :title="t('statistics.totalSpending')"
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
          :title="t('statistics.averageExpense')"
          :value="formatCurrency(filteredAverageExpense)"
          icon="📈"
        />
        <StatisticsCard
          :title="t('statistics.totalExpenses')"
          :value="filteredExpenses.length"
          :subtitle="t('statistics.items')"
          icon="📝"
        />
      </div>

      <!-- Charts Section -->
      <div class="charts-section">
        <!-- Spending by Category - Pie Chart -->
        <Card>
          <h2 class="chart-title">{{ t('statistics.spendingByCategory') }}</h2>
          <div class="chart-container">
            <PieChart :data="categoryPieData" :size="250" />
          </div>
        </Card>

        <!-- Spending by Category - Bar Chart -->
        <Card>
          <h2 class="chart-title">{{ t('statistics.topCategories') }}</h2>
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
        <h2 class="chart-title">{{ t('statistics.topFiveCategories') }}</h2>
        <div class="top-categories-list">
          <div
            v-for="(category, index) in filteredTopCategories"
            :key="category.category"
            class="top-category-item"
          >
            <div class="top-category-rank">#{{ index + 1 }}</div>
            <div class="top-category-info">
              <div class="top-category-name">
                {{ getCategoryName(category.category) }}
              </div>
              <div class="top-category-amount">
                {{ formatCurrency(category.amount) }}
              </div>
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
import { Card } from '@/shared/ui/Card'
import { StatisticsCard } from '@/widgets/statistics-card/ui'
import { PieChart } from '@/shared/ui/PieChart'
import { BarChart } from '@/shared/ui/BarChart'
import { LineChart } from '@/shared/ui/LineChart'
import { PeriodFilter } from '@/features/period-filter/ui'
import { useStatisticsPage } from './useStatisticsPage'

const {
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
} = useStatisticsPage()
</script>

<style scoped src="./StatisticsPage.css"></style>
