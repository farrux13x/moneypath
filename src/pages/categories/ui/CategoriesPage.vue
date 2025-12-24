<template>
  <div :class="$style['categories-page']">
    <div :class="$style['page-container']">
      <header :class="$style['page-header']">
        <h1 :class="$style['page-title']">📁 Manage Categories</h1>
        <p :class="$style['page-subtitle']">Add and organize your expense categories</p>
      </header>

      <div :class="$style['page-content']">
        <div :class="$style['content-section']">
          <AddCategoryForm />
        </div>

        <div :class="$style['content-section']">
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

<style module src="./CategoriesPage.module.css"></style>
