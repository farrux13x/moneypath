<template>
  <header :class="$style['top-navigation']">
    <div :class="$style['top-navigation__brand']">MoneyTrack</div>
    <nav :class="$style['top-navigation__links']">
      <button
        v-for="item in navItems"
        :key="item.id"
        :class="[$style['nav-link'], { [$style.active]: currentPage === item.id }]"
        @click="navigate(item.id)"
        :aria-label="item.label"
      >
        <span :class="$style['nav-icon']">{{ item.icon }}</span>
        <span :class="$style['nav-label']">{{ item.label }}</span>
      </button>
    </nav>
  </header>
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
  { id: 'home', label: 'Transactions', icon: 'H' },
  { id: 'statistics', label: 'Statistics', icon: 'S' },
  { id: 'categories', label: 'Categories', icon: 'C' },
  { id: 'chat', label: 'Chat', icon: 'T' },
  { id: 'profile', label: 'Profile', icon: 'P' },
]

const navigate = (page: string) => {
  emit('navigate', page)
}
</script>

<style module src="./TopNavigation.module.css"></style>
