<template>
  <div class="settings-page">
    <div class="page-container">
      <header class="page-header">
        <h1 class="page-title">{{ t('settings.title') }}</h1>
        <p class="page-subtitle">{{ t('settings.subtitle') }}</p>
      </header>

      <div class="settings-list">
        <button class="settings-item" @click="goToProfile">
          <div class="settings-item-text">
            <span class="settings-item-title">{{ t('settings.profile') }}</span>
            <span class="settings-item-subtitle">{{
              t('settings.profileSubtitle')
            }}</span>
          </div>
          <span class="settings-item-icon">></span>
        </button>

        <button class="settings-item" @click="goToExport">
          <div class="settings-item-text">
            <span class="settings-item-title">{{ t('settings.export') }}</span>
            <span class="settings-item-subtitle">{{
              t('settings.exportSubtitle')
            }}</span>
          </div>
          <span class="settings-item-icon">></span>
        </button>

        <div class="settings-item settings-item--select">
          <div class="settings-item-text">
            <span class="settings-item-title">{{ t('common.language') }}</span>
            <span class="settings-item-subtitle">{{
              t('settings.languageSubtitle')
            }}</span>
          </div>
          <select v-model="locale" class="settings-select">
            <option v-for="lang in locales" :key="lang" :value="lang">
              {{ t(`common.languages.${lang}`) }}
            </option>
          </select>
        </div>

        <div class="settings-item settings-item--toggle">
          <div class="settings-item-text">
            <span class="settings-item-title">{{ t('settings.theme') }}</span>
            <span class="settings-item-subtitle">{{
              t('settings.themeSubtitle')
            }}</span>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ThemeToggle } from '@/shared/ui/ThemeToggle'
import { useI18n } from '@/shared/i18n'

const { t, locale, locales } = useI18n()

const goToProfile = () => {
  window.location.hash = 'profile'
}

const goToExport = () => {
  window.location.hash = 'export'
}
</script>

<style scoped src="./SettingsPage.css"></style>
