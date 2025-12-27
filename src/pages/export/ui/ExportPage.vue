<template>
  <div class="export-page">
    <div class="page-container">
      <header class="page-header">
        <h1 class="page-title">{{ t('export.title') }}</h1>
        <p class="page-subtitle">{{ t('export.subtitle') }}</p>
      </header>

      <div class="export-content">
        <div class="export-section">
          <ExportData />
        </div>

        <div class="export-section">
          <ImportData />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ExportData } from '@/features/export-data/ui'
import { ImportData } from '@/features/import-data/ui'
import { useExportPage } from './useExportPage'

const { t } = useExportPage()
</script>

<style scoped src="./ExportPage.css"></style>
