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

        <a
          class="settings-item settings-item--link"
          href="https://github.com/farrux13x/moneypath"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div class="settings-item-main">
            <span class="settings-item-icon-badge" aria-hidden="true">
              <svg viewBox="0 0 24 24" role="img" focusable="false">
                <path
                  d="M12 2c-5.52 0-10 4.58-10 10.23 0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.48 0-.24-.01-.88-.01-1.72-2.78.62-3.37-1.38-3.37-1.38-.45-1.17-1.1-1.48-1.1-1.48-.9-.63.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.32.1-2.74 0 0 .84-.27 2.75 1.05A9.25 9.25 0 0 1 12 6.9c.85 0 1.7.12 2.5.34 1.91-1.32 2.75-1.05 2.75-1.05.55 1.42.2 2.48.1 2.74.64.72 1.03 1.64 1.03 2.76 0 3.93-2.34 4.8-4.57 5.05.36.32.68.95.68 1.92 0 1.39-.01 2.5-.01 2.84 0 .26.18.58.69.48A10.06 10.06 0 0 0 22 12.23C22 6.58 17.52 2 12 2z"
                />
              </svg>
            </span>
            <div class="settings-item-text">
              <span class="settings-item-title">{{ t('settings.github') }}</span>
              <span class="settings-item-subtitle">{{
                t('settings.githubSubtitle')
              }}</span>
            </div>
          </div>
          <span class="settings-item-icon settings-item-icon--external" aria-hidden="true">
            <svg viewBox="0 0 24 24" role="img" focusable="false">
              <path
                d="M14 3h7v7m0-7-9 9M5 5h6M5 5v14h14v-6"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                fill="none"
              />
            </svg>
          </span>
        </a>

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
import { useSettingsPage } from './useSettingsPage'

const { t, locale, locales, goToProfile, goToExport } = useSettingsPage()
</script>

<style scoped src="./SettingsPage.css"></style>
