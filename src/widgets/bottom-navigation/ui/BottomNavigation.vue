<template>
  <nav :class="$style['bottom-navigation']">
    <button
      v-for="item in navItems"
      :key="item.id"
      :class="[$style['nav-item'], { [$style.active]: currentPage === item.id }]"
      @click="navigate(item.id)"
      :aria-label="item.label"
    >
      <span :class="$style['nav-icon']">{{ item.icon }}</span>
      <span :class="$style['nav-label']">{{ item.label }}</span>
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
  { id: 'profile', label: 'Profile', icon: '👤' },
]

const navigate = (page: string) => {
  emit('navigate', page)
}
</script>

<style module src="./BottomNavigation.module.css"></style>

