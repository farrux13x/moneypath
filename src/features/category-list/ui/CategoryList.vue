<template>
  <Card>
    <h2 class="category-list-title">{{ t('features.categoryList.title') }}</h2>

    <div v-if="categories.length === 0" class="empty-state">
      <p>{{ t('features.categoryList.empty') }}</p>
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
          {{
            isDefaultCategory(category.id)
              ? t('features.categoryList.defaultLabel')
              : t('features.categoryList.deleteLabel')
          }}
        </Button>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { useCategories } from '@/entities/category/model/useCategories'
import { useI18n } from '@/shared/i18n'

const { categories, removeCategory } = useCategories()
const { t } = useI18n()

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
    alert(t('features.categoryList.defaultAlert'))
    return
  }

  if (
    confirm(
      t('features.categoryList.deleteConfirm'),
    )
  ) {
    removeCategory(id)
  }
}
</script>

<style scoped src="./CategoryList.css"></style>
