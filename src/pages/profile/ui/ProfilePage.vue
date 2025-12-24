<template>
  <div :class="$style['profile-page']">
    <div :class="$style['page-container']">
      <header :class="$style['page-header']">
        <h1 :class="$style['page-title']">👤 User Profile</h1>
        <p :class="$style['page-subtitle']">Manage your profile and preferences</p>
      </header>

      <div :class="$style['profile-content']">
        <div :class="$style['profile-section']">
          <ProfileCard />
        </div>

        <div :class="$style['profile-section']">
          <EditProfileForm />
        </div>
      </div>

      <div :class="$style['profile-actions']">
        <Button
          variant="primary"
          full-width
          @click="goToExport"
          :class="$style['settings-button']"
        >
          <span :class="$style['button-icon']">📤</span>
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

<style module src="./ProfilePage.module.css"></style>
