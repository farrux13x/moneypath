<template>
  <div class="add-transaction-page">
    <!-- Mobile Layout -->
    <div class="mobile-layout mobile-only">
      <HomeMobileHeader
        :show-back-button="true"
        title-align="center"
        :title="t('addTransaction.mobileTitle')"
      />

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
import { HomeMobileHeader } from '@/features/home-header/ui'
import { useAddTransactionPage } from './useAddTransactionPage'

const { t, handleExpenseAdded } = useAddTransactionPage()
</script>

<style scoped src="./AddTransactionPage.css"></style>
