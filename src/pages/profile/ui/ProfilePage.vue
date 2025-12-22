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
        <Button variant="primary" full-width @click="goToExport" class="settings-button">
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

<style scoped>
.profile-page {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.page-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem;
}

@media (min-width: 768px) {
  .page-container {
    padding: 2rem;
  }
}

.page-header {
  text-align: center;
  color: white;
}

.page-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.page-subtitle {
  font-size: 1.25rem;
  opacity: 0.95;
}

.profile-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.profile-section {
  width: 100%;
}

.profile-actions {
  width: 100%;
  margin-top: 1rem;
}

.settings-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.button-icon {
  font-size: 1.25rem;
}

@media (min-width: 768px) {
  .page-title {
    font-size: 4rem;
  }
}

@media (max-width: 768px) {
  .profile-content {
    grid-template-columns: 1fr;
  }
}
</style>

