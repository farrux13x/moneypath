import { ref, watch, computed } from 'vue'
import { useUser } from '@/entities/user/model/useUser'

type Theme = 'light' | 'dark' | 'auto'

const currentTheme = ref<Theme>('light')
const effectiveTheme = ref<'light' | 'dark'>('light')

export function useTheme() {
  const { user, updateUser } = useUser()

  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
    }
    return 'light'
  }

  const applyTheme = (theme: Theme) => {
    currentTheme.value = theme

    if (theme === 'auto') {
      effectiveTheme.value = getSystemTheme()
    } else {
      effectiveTheme.value = theme
    }

    const root = document.documentElement
    if (effectiveTheme.value === 'dark') {
      root.classList.add('dark')
      root.classList.remove('light')
    } else {
      root.classList.add('light')
      root.classList.remove('dark')
    }
  }

  const setTheme = (theme: Theme) => {
    applyTheme(theme)
    // Update user preference
    updateUser({ theme })
  }

  const toggleTheme = () => {
    const newTheme = effectiveTheme.value === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }

  // Watch for system theme changes when in auto mode
  if (typeof window !== 'undefined' && window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (currentTheme.value === 'auto') {
        applyTheme('auto')
      }
    }
    mediaQuery.addEventListener('change', handleChange)
  }

  // Initialize theme from user preferences
  if (user.value?.theme) {
    applyTheme(user.value.theme)
  } else {
    applyTheme('light')
  }

  // Watch user theme changes
  watch(
    () => user.value?.theme,
    (newTheme) => {
      if (newTheme) {
        applyTheme(newTheme)
      }
    },
    { immediate: true },
  )

  return {
    currentTheme: computed(() => currentTheme.value),
    effectiveTheme: computed(() => effectiveTheme.value),
    setTheme,
    toggleTheme,
  }
}
