<template>
  <Card>
    <h2 class="form-title">Add New Category</h2>
    <form @submit.prevent="handleSubmit" class="category-form">
      <Input
        v-model="formData.name"
        label="Category Name"
        placeholder="e.g., Groceries"
        :error="errors.name"
      />
      <ColorPicker v-model="formData.color" label="Color" />
      <Button
        type="submit"
        variant="primary"
        full-width
        :disabled="isSubmitting"
      >
        {{ isSubmitting ? 'Adding...' : 'Add Category' }}
      </Button>
    </form>
  </Card>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Input } from '@/shared/ui/Input'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { ColorPicker } from '@/shared/ui/ColorPicker'
import { useCategories } from '@/entities/category/model/useCategories'

const { addCategory } = useCategories()

const formData = reactive({
  name: '',
  color: '#6366f1',
})

const errors = reactive({
  name: '',
})

const isSubmitting = ref(false)

const validateForm = (): boolean => {
  errors.name = ''

  if (!formData.name.trim()) {
    errors.name = 'Please enter a category name'
    return false
  }

  // Validate color format
  if (!/^#[0-9A-F]{6}$/i.test(formData.color)) {
    formData.color = '#6366f1' // Reset to default if invalid
  }

  return true
}

const handleSubmit = () => {
  if (!validateForm()) return

  isSubmitting.value = true

  addCategory({
    name: formData.name.trim(),
    color: formData.color,
  })

  // Reset form
  formData.name = ''
  formData.color = '#6366f1'

  isSubmitting.value = false
}
</script>

<style scoped src="./AddCategoryForm.css"></style>
