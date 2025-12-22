<template>
  <header class="top-navigation">
    <div class="top-navigation__brand">MoneyTrack</div>
    <nav class="top-navigation__links">
      <button
        v-for="item in navItems"
        :key="item.id"
        :class="['nav-link', { active: currentPage === item.id }]"
        @click="navigate(item.id)"
        :aria-label="item.label"
      >
        <span class="nav-icon">{{ item.icon }}</span>
        <span class="nav-label">{{ item.label }}</span>
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
  { id: 'profile', label: 'Profile', icon: 'P' },
]

const navigate = (page: string) => {
  emit('navigate', page)
}
</script>

<style scoped>
.top-navigation {
  position: sticky;
  top: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  padding: 0.75rem 1.5rem;
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  margin-bottom: 2rem;
}

.top-navigation__brand {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
}

.top-navigation__links {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
}

.nav-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.875rem;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  background: none;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
}

.nav-link:hover {
  color: var(--text-primary);
  background-color: var(--bg-tertiary);
}

.nav-link.active {
  color: var(--primary-color);
  border-color: var(--primary-color);
  background-color: var(--bg-secondary);
}

.nav-icon {
  font-size: 1rem;
  line-height: 1;
}

.nav-label {
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
</style>
