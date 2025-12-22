<template>
  <div class="categories-page">
    <div class="page-container">
      <header class="page-header">
        <h1 class="page-title">📁 Manage Categories</h1>
        <p class="page-subtitle">Add and organize your expense categories</p>
      </header>

      <div class="page-content">
        <div class="content-section">
          <AddCategoryForm />
        </div>

        <div class="content-section">
          <CategoryList />
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { AddCategoryForm } from '@/features/add-category/ui'
import { CategoryList } from '@/features/category-list/ui'
</script>

<style scoped>
.categories-page {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.page-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem;
}

@media (min-width: 768px) {
  .page-container {
    padding: 2rem;
  }
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

