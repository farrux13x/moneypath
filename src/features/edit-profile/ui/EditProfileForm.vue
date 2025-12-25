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

const { user, updateUser } = useUser()
const formData = reactive({
  name: '',
  email: '',
  currency: 'USD',
  dateFormat: 'MM/DD/YYYY',
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
  })

  isSubmitting.value = false
  saveSuccess.value = true

  setTimeout(() => {
    saveSuccess.value = false
  }, 3000)
}
</script>

<style scoped src="./EditProfileForm.css"></style>
