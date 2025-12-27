<template>
  <header
    :class="['mobile-header', 'mobile-only', `mobile-header--${props.titleAlign}`]"
  >
    <div class="header-left">
      <button
        v-if="props.showBackButton"
        class="back-button"
        type="button"
        :aria-label="props.backLabel"
        @click="goBack"
      >
        <span class="back-icon">&larr;</span>
      </button>
    </div>
    <h1 class="mobile-title">{{ props.title }}</h1>
    <div class="header-actions">
      <slot></slot>
    </div>
  </header>
</template>

<script setup lang="ts">
interface Props {
  title: string
  titleAlign?: 'left' | 'center'
  showBackButton?: boolean
  backLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  titleAlign: 'left',
  showBackButton: false,
  backLabel: 'Go back',
})

const goBack = () => {
  window.history.back()
}
</script>

<style scoped src="./HomeMobileHeader.css"></style>
