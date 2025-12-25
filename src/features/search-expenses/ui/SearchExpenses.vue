<template>
  <Card>
    <h2 class="search-title">{{ t('features.searchExpenses.title') }}</h2>

    <div class="search-form">
      <Input
        v-model="searchQuery"
        :label="t('features.searchExpenses.searchLabel')"
        :placeholder="t('features.searchExpenses.searchPlaceholder')"
        @input="handleSearch"
      />

      <div class="search-filters">
        <div class="filter-group">
          <label class="filter-label">{{
            t('features.searchExpenses.categoryLabel')
          }}</label>
          <select
            v-model="filters.category"
            @change="handleSearch"
            class="filter-select"
          >
            <option value="">{{
              t('features.searchExpenses.categoryAll')
            }}</option>
            <option
              v-for="category in categories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.name }}
            </option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label">{{
            t('features.searchExpenses.amountRangeLabel')
          }}</label>
          <div class="amount-range">
            <Input
              v-model.number="filters.minAmount"
              type="number"
              :placeholder="t('features.searchExpenses.minPlaceholder')"
              @input="handleSearch"
            />
            <span class="range-separator">-</span>
            <Input
              v-model.number="filters.maxAmount"
              type="number"
              :placeholder="t('features.searchExpenses.maxPlaceholder')"
              @input="handleSearch"
            />
          </div>
        </div>

        <div class="filter-group">
          <label class="filter-label">{{
            t('features.searchExpenses.dateRangeLabel')
          }}</label>
          <div class="date-range">
            <Input
              v-model="filters.startDate"
              type="date"
              :placeholder="t('features.searchExpenses.startDatePlaceholder')"
              @input="handleSearch"
            />
            <span class="range-separator">-</span>
            <Input
              v-model="filters.endDate"
              type="date"
              :placeholder="t('features.searchExpenses.endDatePlaceholder')"
              @input="handleSearch"
            />
          </div>
        </div>
      </div>

      <div class="search-actions">
        <Button
          variant="secondary"
          @click="clearFilters"
          :disabled="!hasActiveFilters"
        >
          {{ t('features.searchExpenses.clearFilters') }}
        </Button>
        <div class="results-count">
          {{ filteredExpenses.length }}
          {{
            filteredExpenses.length === 1
              ? t('features.searchExpenses.result')
              : t('features.searchExpenses.results')
          }}
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { Input } from '@/shared/ui/Input'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { useExpenses } from '@/entities/expense/model/useExpenses'
import { useCategories } from '@/entities/category/model/useCategories'
import { useI18n } from '@/shared/i18n'

const { expenses } = useExpenses()
const { categories } = useCategories()
const { t } = useI18n()

const searchQuery = ref('')
const filters = reactive({
  category: '',
  minAmount: null as number | null,
  maxAmount: null as number | null,
  startDate: '',
  endDate: '',
})

const emit = defineEmits<{
  searchResults: [results: typeof expenses.value]
  filtersActive: [active: boolean]
}>()

const hasActiveFilters = computed(() => {
  return (
    searchQuery.value.trim() !== '' ||
    filters.category !== '' ||
    filters.minAmount !== null ||
    filters.maxAmount !== null ||
    filters.startDate !== '' ||
    filters.endDate !== ''
  )
})

const filteredExpenses = computed(() => {
  let results = [...expenses.value]

  // Text search
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    results = results.filter((expense) => {
      const description = expense.description.toLowerCase()
      const categoryName = getCategoryName(expense.category).toLowerCase()
      return description.includes(query) || categoryName.includes(query)
    })
  }

  // Category filter
  if (filters.category) {
    results = results.filter((expense) => expense.category === filters.category)
  }

  // Amount range filter
  if (filters.minAmount !== null && filters.minAmount !== undefined) {
    results = results.filter((expense) => expense.amount >= filters.minAmount!)
  }
  if (filters.maxAmount !== null && filters.maxAmount !== undefined) {
    results = results.filter((expense) => expense.amount <= filters.maxAmount!)
  }

  // Date range filter
  if (filters.startDate) {
    results = results.filter((expense) => expense.date >= filters.startDate)
  }
  if (filters.endDate) {
    results = results.filter((expense) => expense.date <= filters.endDate)
  }

  // Sort by date (newest first)
  results.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  return results
})

const getCategoryName = (categoryId: string): string => {
  return (
    categories.value.find((cat) => cat.id === categoryId)?.name ||
    t('features.searchExpenses.unknownCategory')
  )
}

const handleSearch = () => {
  emit('searchResults', filteredExpenses.value)
  emit('filtersActive', hasActiveFilters.value)
}

const clearFilters = () => {
  searchQuery.value = ''
  filters.category = ''
  filters.minAmount = null
  filters.maxAmount = null
  filters.startDate = ''
  filters.endDate = ''
  handleSearch()
}

// Watch for changes and emit results
watch(
  [filteredExpenses, searchQuery, filters],
  () => {
    handleSearch()
  },
  { immediate: true },
)

// Emit initial state
watch(
  hasActiveFilters,
  (active) => {
    emit('filtersActive', active)
  },
  { immediate: true },
)
</script>

<style scoped src="./SearchExpenses.css"></style>
