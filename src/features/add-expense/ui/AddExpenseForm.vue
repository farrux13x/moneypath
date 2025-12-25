<template>
  <Card>
    <h2 class="form-title">{{ t('features.addExpense.title') }}</h2>
    <form @submit.prevent="handleSubmit" class="expense-form">
      <Input
        v-model.number="formData.amount"
        type="number"
        :label="t('features.addExpense.amountLabel')"
        :placeholder="t('features.addExpense.amountPlaceholder')"
        :error="errors.amount"
      />

      <div class="input-wrapper">
        <label class="input-label">{{
          t('features.addExpense.categoryLabel')
        }}</label>
        <select
          v-model="formData.category"
          :class="['input', { 'input--error': errors.category }]"
        >
          <option value="">
            {{ t('features.addExpense.categoryPlaceholder') }}
          </option>
          <option
            v-for="category in categories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>
        <span v-if="errors.category" class="input-error">{{
          errors.category
        }}</span>
      </div>

      <Input
        v-model="formData.description"
        :label="t('features.addExpense.descriptionLabel')"
        :placeholder="t('features.addExpense.descriptionPlaceholder')"
        :error="errors.description"
      />

      <Input
        v-model="formData.date"
        type="date"
        :label="t('features.addExpense.dateLabel')"
        :error="errors.date"
      />

      <Button
        type="submit"
        variant="primary"
        full-width
        :disabled="isSubmitting"
      >
        {{
          isSubmitting
            ? t('features.addExpense.submitting')
            : t('features.addExpense.submit')
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
import { useExpenses } from '@/entities/expense/model/useExpenses'
import { useCategories } from '@/entities/category/model/useCategories'
import { useI18n } from '@/shared/i18n'

const { addExpense } = useExpenses()
const { categories } = useCategories()
const { t } = useI18n()

const emit = defineEmits<{
  'expense-added': []
}>()

const formData = reactive({
  amount: '' as number | string,
  category: '',
  description: '',
  date: new Date().toISOString().split('T')[0],
})

const errors = reactive({
  amount: '',
  category: '',
  description: '',
  date: '',
})

const isSubmitting = ref(false)

const validateForm = (): boolean => {
  errors.amount = ''
  errors.category = ''
  errors.description = ''
  errors.date = ''

  if (!formData.amount || Number(formData.amount) <= 0) {
    errors.amount = t('features.addExpense.errors.amountInvalid')
    return false
  }

  if (!formData.category) {
    errors.category = t('features.addExpense.errors.categoryRequired')
    return false
  }

  if (!formData.date) {
    errors.date = t('features.addExpense.errors.dateRequired')
    return false
  }

  return true
}

const handleSubmit = () => {
  if (!validateForm()) return

  isSubmitting.value = true

  addExpense({
    amount: Number(formData.amount),
    category: formData.category,
    description: formData.description.trim() || '',
    date: formData.date,
  })

  // Reset form
  formData.amount = ''
  formData.category = ''
  formData.description = ''
  formData.date = new Date().toISOString().split('T')[0]

  isSubmitting.value = false

  // Emit event when expense is added
  emit('expense-added')
}
</script>

<style scoped src="./AddExpenseForm.css"></style>
