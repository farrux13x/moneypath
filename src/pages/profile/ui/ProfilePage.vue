<template>
  <div class="profile-page">
    <div class="page-container">
      <header class="page-header">
        <h1 class="page-title">👤 User Profile</h1>
        <p class="page-subtitle">Manage your profile and preferences</p>
      </header>

      <div class="profile-content">
        <div class="profile-section">
          <ProfileCard />
        </div>

        <div class="profile-section">
          <EditProfileForm />
        </div>
      </div>

      <div class="profile-actions">
        <Button
          variant="primary"
          full-width
          @click="goToExport"
          class="settings-button"
        >
          <span class="button-icon">📤</span>
          <span>Export</span>
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/shared/ui/Button'
import { ProfileCard } from '@/widgets/profile-card/ui'
import { EditProfileForm } from '@/features/edit-profile/ui'

const goToExport = () => {
  window.location.hash = 'export'
}
</script>

<style scoped src="./ProfilePage.css"></style>
