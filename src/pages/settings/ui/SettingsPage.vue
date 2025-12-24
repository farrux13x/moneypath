<template>
  <div class="settings-page">
    <div class="page-container">
      <header class="page-header">
        <h1 class="page-title">{{ t('settings.title') }}</h1>
        <p class="page-subtitle">{{ t('settings.subtitle') }}</p>
      </header>

      <div class="settings-content">
        <div class="settings-section">
          <ThemeToggleCard />
        </div>

        <div class="settings-section">
          <ExportData />
        </div>

        <div class="settings-section">
          <ImportData />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ThemeToggleCard } from '@/features/theme-toggle/ui'
import { ExportData } from '@/features/export-data/ui'
import { ImportData } from '@/features/import-data/ui'
import { useI18n } from '@/shared/i18n'

const { t } = useI18n()
</script>

<style scoped src="./SettingsPage.css"></style>
