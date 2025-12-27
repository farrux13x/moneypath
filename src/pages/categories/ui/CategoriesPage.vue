<template>
  <div class="categories-page">
    <HomeMobileHeader
      :title="t('categories.title')"
    />
    <div class="page-container">
      <header class="page-header desktop-only">
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
import { HomeMobileHeader } from '@/features/home-header/ui'
import { useCategoriesPage } from './useCategoriesPage'

const { t } = useCategoriesPage()
</script>

<style scoped src="./CategoriesPage.css"></style>
