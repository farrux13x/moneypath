<template>
  <div class="add-transaction-page">
    <!-- Mobile Layout -->
    <div class="mobile-layout mobile-only">
      <header class="mobile-header">
        <button class="back-button" @click="goBack" :aria-label="t('common.goBack')">
          <span class="back-icon">←</span>
        </button>
        <h1 class="mobile-title">{{ t('addTransaction.mobileTitle') }}</h1>
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
          <h1 class="page-title">{{ t('addTransaction.desktopTitle') }}</h1>
          <p class="page-subtitle">{{ t('addTransaction.subtitle') }}</p>
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
import { useI18n } from '@/shared/i18n'

const { t } = useI18n()

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
