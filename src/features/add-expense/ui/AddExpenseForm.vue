<template>
  <Card>
    <h2 class="form-title">Add New Expense</h2>
    <form @submit.prevent="handleSubmit" class="expense-form">
      <Input
        v-model.number="formData.amount"
        type="number"
        label="Amount"
        placeholder="0.00"
        :error="errors.amount"
      />

      <div class="input-wrapper">
        <label class="input-label">Category</label>
        <select
          v-model="formData.category"
          :class="['input', { 'input--error': errors.category }]"
        >
          <option value="">Select a category</option>
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
        label="Description"
        placeholder="What did you spend on?"
        :error="errors.description"
      />

      <Input
        v-model="formData.date"
        type="date"
        label="Date"
        :error="errors.date"
      />

      <Button
        type="submit"
        variant="primary"
        full-width
        :disabled="isSubmitting"
      >
        {{ isSubmitting ? 'Adding...' : 'Add Expense' }}
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

const { addExpense } = useExpenses()
const { categories } = useCategories()

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
    errors.amount = 'Please enter a valid amount'
    return false
  }

  if (!formData.category) {
    errors.category = 'Please select a category'
    return false
  }

  if (!formData.date) {
    errors.date = 'Please select a date'
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

<style scoped>
.form-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

.expense-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
}

select.input {
  width: 100%;
  padding: 0.625rem 0.875rem;
  font-size: 1rem;
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  background-color: var(--bg-primary);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
}

select.input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgb(99 102 241 / 0.1);
}

select.input--error {
  border-color: var(--danger-color);
}
</style>
