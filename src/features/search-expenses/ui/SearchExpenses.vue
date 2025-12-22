<template>
  <Card>
    <h2 class="search-title">🔍 Search Expenses</h2>

    <div class="search-form">
      <Input
        v-model="searchQuery"
        label="Search"
        placeholder="Search by description, category..."
        @input="handleSearch"
      />

      <div class="search-filters">
        <div class="filter-group">
          <label class="filter-label">Category</label>
          <select
            v-model="filters.category"
            @change="handleSearch"
            class="filter-select"
          >
            <option value="">All Categories</option>
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
          <label class="filter-label">Amount Range</label>
          <div class="amount-range">
            <Input
              v-model.number="filters.minAmount"
              type="number"
              placeholder="Min"
              @input="handleSearch"
            />
            <span class="range-separator">-</span>
            <Input
              v-model.number="filters.maxAmount"
              type="number"
              placeholder="Max"
              @input="handleSearch"
            />
          </div>
        </div>

        <div class="filter-group">
          <label class="filter-label">Date Range</label>
          <div class="date-range">
            <Input
              v-model="filters.startDate"
              type="date"
              placeholder="Start Date"
              @input="handleSearch"
            />
            <span class="range-separator">-</span>
            <Input
              v-model="filters.endDate"
              type="date"
              placeholder="End Date"
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
          Clear Filters
        </Button>
        <div class="results-count">
          {{ filteredExpenses.length }}
          {{ filteredExpenses.length === 1 ? 'result' : 'results' }}
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

const { expenses } = useExpenses()
const { categories } = useCategories()

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
    categories.value.find((cat) => cat.id === categoryId)?.name || 'Unknown'
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

<style scoped>
.search-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

.search-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.search-filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.25rem;
  padding: 1.25rem;
  background-color: var(--bg-secondary);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
}

.filter-select {
  width: 100%;
  padding: 0.625rem 0.875rem;
  font-size: 1rem;
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  background-color: var(--bg-primary);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgb(99 102 241 / 0.1);
}

.amount-range,
.date-range {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.amount-range :deep(.input-wrapper),
.date-range :deep(.input-wrapper) {
  flex: 1;
}

.range-separator {
  color: var(--text-secondary);
  font-weight: 500;
  flex-shrink: 0;
}

.search-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.results-count {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
}

@media (max-width: 768px) {
  .search-filters {
    grid-template-columns: 1fr;
  }

  .amount-range,
  .date-range {
    flex-direction: column;
    align-items: stretch;
  }

  .range-separator {
    text-align: center;
  }
}
</style>
