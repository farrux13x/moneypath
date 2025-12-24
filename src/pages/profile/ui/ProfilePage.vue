<template>
  <div class="profile-page">
    <div class="page-container">
      <header class="page-header">
        <div class="profile-header-text">
          <h1 class="page-title">{{ t('profile.title') }}</h1>
          <p class="page-subtitle">{{ t('profile.subtitle') }}</p>
        </div>
        <div class="profile-language">
          <label class="profile-language-label" for="profile-language">
            {{ t('common.language') }}
          </label>
          <select
            id="profile-language"
            v-model="locale"
            class="profile-language-select"
          >
            <option v-for="lang in locales" :key="lang" :value="lang">
              {{ t(`common.languages.${lang}`) }}
            </option>
          </select>
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

      <div class="profile-actions">
        <Button
          variant="primary"
          full-width
          @click="goToExport"
          class="settings-button"
        >
          <span class="button-icon">📤</span>
          <span>{{ t('common.export') }}</span>
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/shared/ui/Button'
import { ProfileCard } from '@/widgets/profile-card/ui'
import { EditProfileForm } from '@/features/edit-profile/ui'
import { useI18n } from '@/shared/i18n'

const { t, locale, locales } = useI18n()

const goToExport = () => {
  window.location.hash = 'export'
}
</script>

<style scoped src="./ProfilePage.css"></style>
