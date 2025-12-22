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

<style scoped>
.category-list-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-secondary);
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.category-item {
  padding: 1rem;
  background-color: var(--bg-secondary);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  transition: all 0.2s ease;
}

.category-item:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.category-item-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.category-badge {
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  color: white;
  font-weight: 500;
  font-size: 0.875rem;
}

.category-color-display {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  border: 2px solid var(--border-color);
  flex-shrink: 0;
}

@media (max-width: 640px) {
  .category-item {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
