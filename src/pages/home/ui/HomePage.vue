<template>
  <div class="home-page">
    <!-- Mobile Layout -->
    <div class="mobile-layout mobile-only">
      <header class="mobile-header">
        <h1 class="mobile-title">Transactions</h1>
        <div class="header-actions">
          <button
            class="filter-button"
            @click="showSearch = !showSearch"
            aria-label="Filter"
          >
            <span>🔍</span>
          </button>
          <button
            class="add-button"
            @click="goToAddTransaction"
            aria-label="Add Expense"
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
          <h1 class="page-title">💰 MoneyTrack</h1>
          <p class="page-subtitle">
            Track your expenses and manage your budget
          </p>
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
import { Button } from '@/shared/ui/Button'
import { AddExpenseForm } from '@/features/add-expense/ui'
import { ExpenseList } from '@/features/expense-list/ui'
import { SearchExpenses } from '@/features/search-expenses/ui'
import { SearchResults } from '@/features/search-results/ui'
import { MobileExpenseList } from '@/widgets/mobile-expense-list/ui'
import type { Expense } from '@/entities/expense/model/types'

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

const goToCategories = () => {
  window.location.hash = 'categories'
}

const goToStatistics = () => {
  window.location.hash = 'statistics'
}

const goToSettings = () => {
  window.location.hash = 'settings'
}

const goToProfile = () => {
  window.location.hash = 'profile'
}

const handleExpenseClick = (expense: Expense) => {
  // Handle expense click if needed (e.g., show details, edit)
  console.log('Expense clicked:', expense)
}

const goToAddTransaction = () => {
  window.location.hash = 'add-transaction'
}
</script>

<style scoped>
.home-page {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

/* Mobile Layout */
.mobile-layout {
  width: 100%;
  min-height: calc(100vh - 80px);
}

.mobile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: transparent;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.mobile-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin: 0;
}

.filter-button {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-md);
  padding: 0.5rem;
  color: white;
  cursor: pointer;
  font-size: 1.25rem;
  transition: all 0.2s ease;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.filter-button:active {
  transform: scale(0.95);
  background: rgba(255, 255, 255, 0.2);
}

.add-button {
  background: linear-gradient(
    135deg,
    var(--primary-color),
    var(--secondary-color)
  );
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  color: white;
  cursor: pointer;
  font-size: 1.75rem;
  font-weight: 300;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
  line-height: 1;
}

.add-button:active {
  transform: scale(0.9);
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
}

.add-icon {
  line-height: 1;
}

.mobile-search-section {
  padding: 0 1rem 1rem 1rem;
}

.mobile-results,
.mobile-expenses {
  padding: 0;
}

/* Desktop Layout */
.desktop-layout {
  width: 100%;
}

.page-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
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

.page-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

.content-section {
  width: 100%;
}

.search-results-section,
.expense-list-section {
  width: 100%;
  grid-column: 1 / -1;
}

.navigation {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

@media (min-width: 1024px) {
  .page-content {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 768px) {
  .page-title {
    font-size: 4rem;
  }
}
</style>
