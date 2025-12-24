<template>
  <div class="add-transaction-page">
    <!-- Mobile Layout -->
    <div class="mobile-layout mobile-only">
      <header class="mobile-header">
        <button class="back-button" @click="goBack" aria-label="Go back">
          <span class="back-icon">←</span>
        </button>
        <h1 class="mobile-title">Add Transaction</h1>
        <div class="header-spacer"></div>
      </header>

      <div class="form-container">
        <AddExpenseForm @expense-added="handleExpenseAdded" />
      </div>
    </div>

    <!-- Desktop Layout -->
    <div class="desktop-layout desktop-only">
      <div class="page-container">
        <header class="page-header">
          <h1 class="page-title">➕ Add Transaction</h1>
          <p class="page-subtitle">Record a new expense</p>
        </header>

        <div class="form-container">
          <AddExpenseForm @expense-added="handleExpenseAdded" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AddExpenseForm } from '@/features/add-expense/ui'

const goBack = () => {
  window.history.back()
}

const handleExpenseAdded = () => {
  // Navigate back to transactions page after adding
  setTimeout(() => {
    window.location.hash = ''
  }, 500)
}
</script>

<style scoped src="./AddTransactionPage.css"></style>
