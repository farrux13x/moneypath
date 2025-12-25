<template>
  <Card>
    <h2 class="form-title">{{ t('features.editProfile.title') }}</h2>
    <form @submit.prevent="handleSubmit" class="profile-form">
      <Input
        v-model="formData.name"
        :label="t('features.editProfile.nameLabel')"
        :placeholder="t('features.editProfile.namePlaceholder')"
        :error="errors.name"
      />

      <Input
        v-model="formData.email"
        type="email"
        :label="t('features.editProfile.emailLabel')"
        :placeholder="t('features.editProfile.emailPlaceholder')"
        :error="errors.email"
      />

      <div class="input-wrapper">
        <label class="input-label">{{
          t('features.editProfile.currencyLabel')
        }}</label>
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
        <label class="input-label">{{
          t('features.editProfile.dateFormatLabel')
        }}</label>
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
        {{
          isSubmitting
            ? t('features.editProfile.submitting')
            : t('features.editProfile.submit')
        }}
      </Button>

      <div v-if="saveSuccess" class="success-message">
        {{ t('features.editProfile.success') }}
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
import { useI18n } from '@/shared/i18n'

const { user, updateUser } = useUser()
const { t } = useI18n()
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
    errors.name = t('features.editProfile.errors.nameRequired')
    return false
  }

  if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = t('features.editProfile.errors.emailInvalid')
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
