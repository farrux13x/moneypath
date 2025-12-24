<template>
  <div :class="$style['home-page']">
    <!-- Mobile Layout -->
    <div :class="[$style['mobile-layout'], $style['mobile-only']]">
      <header :class="$style['mobile-header']">
        <h1 :class="$style['mobile-title']">Transactions</h1>
        <div :class="$style['header-actions']">
          <button
            :class="$style['filter-button']"
            @click="showSearch = !showSearch"
            aria-label="Filter"
          >
            <span>🔍</span>
          </button>
          <button
            :class="$style['add-button']"
            @click="goToAddTransaction"
            aria-label="Add Expense"
          >
            <span :class="$style['add-icon']">+</span>
          </button>
        </div>
      </header>

      <div v-if="showSearch" :class="$style['mobile-search-section']">
        <SearchExpenses
          @search-results="handleSearchResults"
          @filters-active="handleFiltersActive"
        />
      </div>

      <div v-if="showSearchResults" :class="$style['mobile-results']">
        <SearchResults :results="searchResults" />
      </div>

      <div v-else :class="$style['mobile-expenses']">
        <MobileExpenseList @expense-click="handleExpenseClick" />
      </div>
    </div>

    <!-- Desktop Layout -->
    <div :class="[$style['desktop-layout'], $style['desktop-only']]">
      <div :class="$style['page-container']">
        <header :class="$style['page-header']">
          <h1 :class="$style['page-title']">💰 MoneyTrack</h1>
          <p :class="$style['page-subtitle']">
            Track your expenses and manage your budget
          </p>
        </header>

        <div :class="$style['page-content']">
          <div :class="$style['content-section']">
            <AddExpenseForm />
          </div>

          <div :class="$style['content-section']">
            <SearchExpenses
              @search-results="handleSearchResults"
              @filters-active="handleFiltersActive"
            />
          </div>
        </div>

        <div v-if="showSearchResults" :class="$style['search-results-section']">
          <SearchResults :results="searchResults" />
        </div>

        <div v-else :class="$style['expense-list-section']">
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

<style module src="./HomePage.module.css"></style>
