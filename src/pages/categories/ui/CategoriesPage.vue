<template>
  <div class="categories-page">
    <div class="page-container">
      <header class="page-header">
        <h1 class="page-title">{{ t('categories.title') }}</h1>
        <p class="page-subtitle">{{ t('categories.subtitle') }}</p>
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
import { useI18n } from '@/shared/i18n'

const { t } = useI18n()
</script>

<style scoped src="./CategoriesPage.css"></style>
