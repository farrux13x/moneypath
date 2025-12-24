<template>
  <div :class="$style['settings-page']">
    <div :class="$style['page-container']">
      <header :class="$style['page-header']">
        <h1 :class="$style['page-title']">📤 Export</h1>
        <p :class="$style['page-subtitle']">Export and import your data</p>
      </header>

      <div :class="$style['settings-content']">
        <div :class="$style['settings-section']">
          <ThemeToggleCard />
        </div>

        <div :class="$style['settings-section']">
          <ExportData />
        </div>

        <div :class="$style['settings-section']">
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

<style module src="./SettingsPage.module.css"></style>
