<template>
  <div class="home-page">
    <!-- Mobile Layout -->
    <div class="mobile-layout mobile-only">
      <header class="mobile-header">
        <h1 class="mobile-title">{{ t('home.mobileTitle') }}</h1>
        <div class="header-actions">
          <FilterButton
            @click="showSearch = !showSearch"
            :ariaLabel="t('common.filter')"
          />
          <AddButton
            @click="goToAddTransaction"
            :ariaLabel="t('common.addExpense')"
          />
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
import { AddExpenseForm } from '@/features/add-expense/ui'
import { AddButton, FilterButton } from '@/features/home-actions/ui'
import { ExpenseList } from '@/features/expense-list/ui'
import { SearchExpenses } from '@/features/search-expenses/ui'
import { SearchResults } from '@/features/search-results/ui'
import { MobileExpenseList } from '@/widgets/mobile-expense-list/ui'
import { useHomePage } from './useHomePage'

defineEmits<{
  'add-expense': []
}>()

const {
  t,
  searchResults,
  showSearchResults,
  showSearch,
  handleSearchResults,
  handleFiltersActive,
  handleExpenseClick,
  goToAddTransaction,
} = useHomePage()
</script>

<style scoped src="./HomePage.css"></style>




