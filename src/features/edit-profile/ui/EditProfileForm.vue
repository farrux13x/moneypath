<template>
  <Card>
    <h2 class="form-title">Edit Profile</h2>
    <form @submit.prevent="handleSubmit" class="profile-form">
      <Input
        v-model="formData.name"
        label="Name"
        placeholder="Your name"
        :error="errors.name"
      />

      <Input
        v-model="formData.email"
        type="email"
        label="Email"
        placeholder="your.email@example.com"
        :error="errors.email"
      />

      <div class="input-wrapper">
        <label class="input-label">Currency</label>
        <select v-model="formData.currency" class="input">
          <option value="USD">USD ($)</option>
          <option value="EUR">EUR (€)</option>
          <option value="GBP">GBP (£)</option>
          <option value="JPY">JPY (¥)</option>
          <option value="CNY">CNY (¥)</option>
          <option value="INR">INR (₹)</option>
          <option value="CAD">CAD ($)</option>
          <option value="AUD">AUD ($)</option>
          <option value="CHF">CHF (Fr)</option>
          <option value="RUB">RUB (₽)</option>
        </select>
      </div>

      <div class="input-wrapper">
        <label class="input-label">Date Format</label>
        <select v-model="formData.dateFormat" class="input">
          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          <option value="DD.MM.YYYY">DD.MM.YYYY</option>
        </select>
      </div>

      <div class="input-wrapper">
        <label class="input-label">Theme</label>
        <select v-model="formData.theme" class="input">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="auto">Auto (System)</option>
        </select>
      </div>

      <Button
        type="submit"
        variant="primary"
        full-width
        :disabled="isSubmitting"
      >
        {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
      </Button>

      <div v-if="saveSuccess" class="success-message">
        ✅ Profile updated successfully!
      </div>
    </form>
  </Card>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Input } from '@/shared/ui/Input'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { useUser } from '@/entities/user/model/useUser'
import { useTheme } from '@/shared/lib/theme/useTheme'

const { user, updateUser } = useUser()
const { setTheme } = useTheme()

const formData = reactive({
  name: '',
  email: '',
  currency: 'USD',
  dateFormat: 'MM/DD/YYYY',
  theme: 'light' as 'light' | 'dark' | 'auto',
})

const errors = reactive({
  name: '',
  email: '',
})

const isSubmitting = ref(false)
const saveSuccess = ref(false)

onMounted(() => {
  if (user.value) {
    formData.name = user.value.name
    formData.email = user.value.email
    formData.currency = user.value.currency
    formData.dateFormat = user.value.dateFormat
    formData.theme = user.value.theme
  }
})

const validateForm = (): boolean => {
  errors.name = ''
  errors.email = ''

  if (!formData.name.trim()) {
    errors.name = 'Please enter your name'
    return false
  }

  if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Please enter a valid email address'
    return false
  }

  return true
}

const handleSubmit = () => {
  if (!validateForm()) return

  isSubmitting.value = true
  saveSuccess.value = false

  updateUser({
    name: formData.name.trim(),
    email: formData.email.trim(),
    currency: formData.currency,
    dateFormat: formData.dateFormat,
    theme: formData.theme,
  })

  // Apply theme immediately
  setTheme(formData.theme)

  isSubmitting.value = false
  saveSuccess.value = true

  setTimeout(() => {
    saveSuccess.value = false
  }, 3000)
}
</script>

<style scoped>
.form-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

.profile-form {
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

.success-message {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #d1fae5;
  color: #065f46;
  border-radius: var(--radius-md);
  text-align: center;
  font-size: 0.875rem;
}
</style>
