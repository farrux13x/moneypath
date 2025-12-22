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

<style scoped>
.add-transaction-page {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

/* Mobile Layout */
.mobile-layout {
  width: 100%;
  min-height: 100vh;
  padding-bottom: 2rem;
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

.back-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-md);
  color: white;
  cursor: pointer;
  font-size: 1.25rem;
  transition: all 0.2s ease;
}

.back-button:active {
  transform: scale(0.95);
  background: rgba(255, 255, 255, 0.2);
}

.back-icon {
  line-height: 1;
}

.mobile-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  margin: 0;
  flex: 1;
  text-align: center;
}

.header-spacer {
  width: 40px;
}

.form-container {
  padding: 0 1rem 1rem 1rem;
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

@media (min-width: 768px) {
  .page-title {
    font-size: 4rem;
  }
}
</style>
