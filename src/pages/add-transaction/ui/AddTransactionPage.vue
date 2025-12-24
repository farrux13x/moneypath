<template>
  <div :class="$style['add-transaction-page']">
    <!-- Mobile Layout -->
    <div :class="[$style['mobile-layout'], $style['mobile-only']]">
      <header :class="$style['mobile-header']">
        <button :class="$style['back-button']" @click="goBack" aria-label="Go back">
          <span :class="$style['back-icon']">←</span>
        </button>
        <h1 :class="$style['mobile-title']">Add Transaction</h1>
        <div :class="$style['header-spacer']"></div>
      </header>

      <div :class="$style['form-container']">
        <AddExpenseForm @expense-added="handleExpenseAdded" />
      </div>
    </div>

    <!-- Desktop Layout -->
    <div :class="[$style['desktop-layout'], $style['desktop-only']]">
      <div :class="$style['page-container']">
        <header :class="$style['page-header']">
          <h1 :class="$style['page-title']">➕ Add Transaction</h1>
          <p :class="$style['page-subtitle']">Record a new expense</p>
        </header>

        <div :class="$style['form-container']">
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

<style module src="./AddTransactionPage.module.css"></style>
