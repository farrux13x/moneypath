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
  { id: 'profile', label: 'Profile', icon: '👤' },
]

const navigate = (page: string) => {
  emit('navigate', page)
}
</script>

<style scoped>
.bottom-navigation {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: var(--bg-primary);
  border-top: 1px solid var(--border-color);
  padding: 0.5rem 0;
  padding-bottom: max(0.5rem, env(safe-area-inset-bottom));
  z-index: 1000;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.2s ease;
  flex: 1;
  position: relative;
}

.nav-item:active {
  transform: scale(0.95);
}

.nav-item.active {
  color: var(--primary-color);
}

.nav-icon {
  font-size: 1.5rem;
  line-height: 1;
}

.nav-label {
  font-size: 0.625rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

@media (min-width: 641px) {
  .bottom-navigation {
    display: none;
  }
}
</style>

