<template>
  <div class="profile-page">
    <HomeMobileHeader
      :title="t('profile.title')"
    />
    <div class="page-container">
      <header class="page-header desktop-only">
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
import { HomeMobileHeader } from '@/features/home-header/ui'
import { useProfilePage } from './useProfilePage'

const { t } = useProfilePage()
</script>

<style scoped src="./ProfilePage.css"></style>
