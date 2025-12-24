<template>
  <Card>
    <h2 class="category-list-title">Categories</h2>

    <div v-if="categories.length === 0" class="empty-state">
      <p>No categories yet. Add your first category above!</p>
    </div>

    <div v-else class="category-list">
      <div
        v-for="category in categories"
        :key="category.id"
        class="category-item"
      >
        <div class="category-item-content">
          <div
            class="category-badge"
            :style="{ backgroundColor: category.color }"
          >
            {{ category.name }}
          </div>
          <div
            class="category-color-display"
            :style="{ backgroundColor: category.color }"
          ></div>
        </div>
        <Button
          variant="danger"
          size="sm"
          @click="handleRemove(category.id)"
          :disabled="isDefaultCategory(category.id)"
        >
          {{ isDefaultCategory(category.id) ? 'Default' : 'Delete' }}
        </Button>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { useCategories } from '@/entities/category/model/useCategories'

const { categories, removeCategory } = useCategories()

const defaultCategoryIds = [
  'food',
  'transport',
  'shopping',
  'bills',
  'entertainment',
  'health',
  'education',
  'other',
]

const isDefaultCategory = (id: string): boolean => {
  return defaultCategoryIds.includes(id)
}

const handleRemove = (id: string) => {
  if (isDefaultCategory(id)) {
    alert('Default categories cannot be deleted')
    return
  }

  if (
    confirm(
      'Are you sure you want to delete this category? Expenses using this category will still be visible.',
    )
  ) {
    removeCategory(id)
  }
}
</script>

<style scoped src="./CategoryList.css"></style>
