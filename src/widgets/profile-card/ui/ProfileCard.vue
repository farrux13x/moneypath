<template>
  <Card>
    <div class="profile-card">
      <div class="profile-avatar">
        <div class="avatar-circle">
          {{ userInitials }}
        </div>
      </div>

      <div class="profile-info">
        <h2 class="profile-name">{{ user?.name || 'User' }}</h2>
        <p v-if="user?.email" class="profile-email">{{ user.email }}</p>
        <p v-else class="profile-email-placeholder">No email set</p>
      </div>

      <div class="profile-details">
        <div class="profile-detail-item">
          <span class="detail-label">Currency:</span>
          <span class="detail-value"
            >{{ getCurrencySymbol(user?.currency || 'USD') }}
            {{ user?.currency || 'USD' }}</span
          >
        </div>
        <div class="profile-detail-item">
          <span class="detail-label">Date Format:</span>
          <span class="detail-value">{{
            user?.dateFormat || 'MM/DD/YYYY'
          }}</span>
        </div>
        <div class="profile-detail-item">
          <span class="detail-label">Theme:</span>
          <span class="detail-value">{{
            capitalize(user?.theme || 'light')
          }}</span>
        </div>
        <div class="profile-detail-item">
          <span class="detail-label">Member Since:</span>
          <span class="detail-value">{{ formatDate(user?.createdAt) }}</span>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Card } from '@/shared/ui/Card'
import { useUser } from '@/entities/user/model/useUser'

const { user } = useUser()

const userInitials = computed(() => {
  if (!user.value?.name) return 'U'
  const names = user.value.name.trim().split(' ')
  if (names.length >= 2) {
    return (names[0][0] + names[names.length - 1][0]).toUpperCase()
  }
  return names[0][0].toUpperCase()
})

const getCurrencySymbol = (currency: string): string => {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    CNY: '¥',
    INR: '₹',
    CAD: '$',
    AUD: '$',
    CHF: 'Fr',
    RUB: '₽',
  }
  return symbols[currency] || '$'
}

const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const formatDate = (dateString?: string): string => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<style scoped src="./ProfileCard.css"></style>
