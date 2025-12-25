<template>
  <div class="profile-page">
    <div class="page-container">
      <header class="page-header">
        <div class="profile-header-text">
          <h1 class="page-title">{{ t('profile.title') }}</h1>
          <p class="page-subtitle">{{ t('profile.subtitle') }}</p>
        </div>
      </header>

      <div class="profile-content">
        <div class="profile-section">
          <ProfileCard />
        </div>

        <div class="profile-section">
          <EditProfileForm />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ProfileCard } from '@/widgets/profile-card/ui'
import { EditProfileForm } from '@/features/edit-profile/ui'
import { useI18n } from '@/shared/i18n'

const { t } = useI18n()
</script>

<style scoped src="./ProfilePage.css"></style>
