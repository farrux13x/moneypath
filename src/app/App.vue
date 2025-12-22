<template>
  <div id="app">
    <TopNavigation
      v-if="currentPage !== 'add-transaction'"
      class="desktop-only"
      :current-page="currentPage"
      @navigate="handleNavigate"
    />
    <HomePage v-if="currentPage === 'home'" />
    <CategoriesPage v-else-if="currentPage === 'categories'" />
    <StatisticsPage v-else-if="currentPage === 'statistics'" />
    <SettingsPage v-else-if="currentPage === 'export'" />
    <ProfilePage v-else-if="currentPage === 'profile'" />
    <AddTransactionPage v-else-if="currentPage === 'add-transaction'" />

    <BottomNavigation
      v-if="currentPage !== 'add-transaction'"
      class="mobile-only"
      :current-page="currentPage"
      @navigate="handleNavigate"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { HomePage } from '@/pages/home/ui'
import { CategoriesPage } from '@/pages/categories/ui'
import { StatisticsPage } from '@/pages/statistics/ui'
import { SettingsPage } from '@/pages/settings/ui'
import { ProfilePage } from '@/pages/profile/ui'
import { AddTransactionPage } from '@/pages/add-transaction/ui'
import { BottomNavigation } from '@/widgets/bottom-navigation/ui'
import { TopNavigation } from '@/widgets/top-navigation/ui'

const currentPage = ref<
  | 'home'
  | 'categories'
  | 'statistics'
  | 'export'
  | 'profile'
  | 'add-transaction'
>('home')

const updatePage = () => {
  const hash = window.location.hash.slice(1)
  if (hash === 'categories') {
    currentPage.value = 'categories'
  } else if (hash === 'statistics') {
    currentPage.value = 'statistics'
  } else if (hash === 'export') {
    currentPage.value = 'export'
  } else if (hash === 'profile') {
    currentPage.value = 'profile'
  } else if (hash === 'add-transaction') {
    currentPage.value = 'add-transaction'
  } else {
    currentPage.value = 'home'
  }
}

const handleNavigate = (page: string) => {
  if (page === 'home') {
    window.location.hash = ''
  } else {
    window.location.hash = page
  }
}

onMounted(() => {
  updatePage()
  window.addEventListener('hashchange', updatePage)
})

onUnmounted(() => {
  window.removeEventListener('hashchange', updatePage)
})
</script>
