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

<style scoped src="./CategoriesPage.css"></style>
