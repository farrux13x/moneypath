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

<style scoped>
.settings-page {
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

.settings-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.settings-section {
  width: 100%;
}


@media (min-width: 768px) {
  .page-title {
    font-size: 4rem;
  }
}

@media (max-width: 768px) {
  .settings-content {
    grid-template-columns: 1fr;
  }
}
</style>

