<template>
  <div class="settings-page">
    <div class="page-container">
      <header class="page-header">
        <h1 class="page-title">📤 Export</h1>
        <p class="page-subtitle">Export and import your data</p>
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
</script>

<style scoped src="./SettingsPage.css"></style>
