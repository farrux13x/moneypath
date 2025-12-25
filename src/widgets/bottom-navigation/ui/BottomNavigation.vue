<template>
  <nav class="bottom-navigation">
    <button
      v-for="item in navItems"
      :key="item.id"
      :class="['nav-item', { active: currentPage === item.id }]"
      @click="navigate(item.id)"
      :aria-label="item.label"
    >
      <span class="nav-icon">{{ item.icon }}</span>
      <span class="nav-label">{{ item.label }}</span>
    </button>
  </nav>
</template>

<script setup lang="ts">
interface Props {
  currentPage: string
}

defineProps<Props>()

const emit = defineEmits<{
  navigate: [page: string]
}>()

const navItems = [
  { id: 'home', label: 'Transactions', icon: '📋' },
  { id: 'statistics', label: 'Statistics', icon: '📊' },
  { id: 'categories', label: 'Categories', icon: '📁' },
  { id: 'chat', label: 'Chat', icon: 'T' },
  { id: 'settings', label: 'Settings', icon: 'S' },
]

const navigate = (page: string) => {
  emit('navigate', page)
}
</script>

<style scoped src="./BottomNavigation.css"></style>

