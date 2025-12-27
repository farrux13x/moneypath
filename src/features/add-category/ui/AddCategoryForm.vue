<template>
  <Card>
    <h2 class="form-title">{{ t('features.addCategory.title') }}</h2>
    <form @submit.prevent="handleSubmit" class="category-form">
      <Input
        v-model="formData.name"
        :label="t('features.addCategory.nameLabel')"
        :placeholder="t('features.addCategory.namePlaceholder')"
        :error="errors.name"
      />
      <ColorPicker
        v-model="formData.color"
        :label="t('features.addCategory.colorLabel')"
      />
      <Button
        type="submit"
        variant="primary"
        full-width
        :disabled="isSubmitting"
      >
        {{
          isSubmitting
            ? t('features.addCategory.submitting')
            : t('features.addCategory.submit')
        }}
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
import { useI18n } from '@/shared/i18n'

const { addCategory } = useCategories()
const { t } = useI18n()

const formData = reactive({
  name: '',
  color: '#2f7f7b',
})

const errors = reactive({
  name: '',
})

const isSubmitting = ref(false)

const validateForm = (): boolean => {
  errors.name = ''

  if (!formData.name.trim()) {
    errors.name = t('features.addCategory.errors.nameRequired')
    return false
  }

  if (!/^#[0-9A-F]{6}$/i.test(formData.color)) {
    formData.color = '#2f7f7b' 
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
  formData.color = '#2f7f7b'

  isSubmitting.value = false
}
</script>

<style scoped src="./AddCategoryForm.css"></style>
