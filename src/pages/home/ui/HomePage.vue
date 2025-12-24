<template>
  <div class="home-page">
    <!-- Mobile Layout -->
    <div class="mobile-layout mobile-only">
      <header class="mobile-header">
        <h1 class="mobile-title">{{ t('home.mobileTitle') }}</h1>
        <div class="header-actions">
          <button
            class="filter-button"
            @click="showSearch = !showSearch"
            :aria-label="t('common.filter')"
          >
            <span>🔍</span>
          </button>
          <button
            class="add-button"
            @click="goToAddTransaction"
            :aria-label="t('common.addExpense')"
          >
            <span class="add-icon">+</span>
          </button>
        </div>
      </header>

      <div v-if="showSearch" class="mobile-search-section">
        <SearchExpenses
          @search-results="handleSearchResults"
          @filters-active="handleFiltersActive"
        />
      </div>

      <div v-if="showSearchResults" class="mobile-results">
        <SearchResults :results="searchResults" />
      </div>

      <div v-else class="mobile-expenses">
        <MobileExpenseList @expense-click="handleExpenseClick" />
      </div>
    </div>

    <!-- Desktop Layout -->
    <div class="desktop-layout desktop-only">
      <div class="page-container">
        <header class="page-header">
          <h1 class="page-title">{{ t('home.desktopTitle') }}</h1>
          <p class="page-subtitle">{{ t('home.desktopSubtitle') }}</p>
        </header>

        <div class="page-content">
          <div class="content-section">
            <AddExpenseForm />
          </div>

          <div class="content-section">
            <SearchExpenses
              @search-results="handleSearchResults"
              @filters-active="handleFiltersActive"
            />
          </div>
        </div>

        <div v-if="showSearchResults" class="search-results-section">
          <SearchResults :results="searchResults" />
        </div>

        <div v-else class="expense-list-section">
          <ExpenseList />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { AddExpenseForm } from '@/features/add-expense/ui'
import { ExpenseList } from '@/features/expense-list/ui'
import { SearchExpenses } from '@/features/search-expenses/ui'
import { SearchResults } from '@/features/search-results/ui'
import { MobileExpenseList } from '@/widgets/mobile-expense-list/ui'
import type { Expense } from '@/entities/expense/model/types'
import { useI18n } from '@/shared/i18n'

const { t } = useI18n()

const searchResults = ref<Expense[]>([])
const showSearchResults = ref(false)
const showSearch = ref(false)

defineEmits<{
  'add-expense': []
}>()

const handleSearchResults = (results: Expense[]) => {
  searchResults.value = results
}

const handleFiltersActive = (active: boolean) => {
  showSearchResults.value = active
}


const handleExpenseClick = (expense: Expense) => {
  // Handle expense click if needed (e.g., show details, edit)
  console.log('Expense clicked:', expense)
}

const goToAddTransaction = () => {
  window.location.hash = 'add-transaction'
}
</script>

<style scoped src="./HomePage.css"></style>
