import { ref, computed } from 'vue'

type Theme = 'light' | 'dark' | 'auto'

const STORAGE_KEY = 'theme'
const currentTheme = ref<Theme>('light')
const effectiveTheme = ref<'light' | 'dark'>('light')
let initialized = false
let mediaListenerAttached = false

const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  }
  return 'light'
}

const getStoredTheme = (): Theme | null => {
  if (typeof localStorage === 'undefined') return null
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark' || stored === 'auto') {
    return stored
  }
  return null
}

const setStoredTheme = (theme: Theme) => {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(STORAGE_KEY, theme)
}

const applyTheme = (theme: Theme) => {
  currentTheme.value = theme

  if (theme === 'auto') {
    effectiveTheme.value = getSystemTheme()
  } else {
    effectiveTheme.value = theme
  }

  if (typeof document !== 'undefined') {
    const root = document.documentElement
    if (effectiveTheme.value === 'dark') {
      root.classList.add('dark')
      root.classList.remove('light')
    } else {
      root.classList.add('light')
      root.classList.remove('dark')
    }
  }
}

const initTheme = () => {
  if (initialized) return

  const storedTheme = getStoredTheme()
  applyTheme(storedTheme ?? 'light')

  // Watch for system theme changes when in auto mode
  if (typeof window !== 'undefined' && window.matchMedia) {
    if (!mediaListenerAttached) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = () => {
        if (currentTheme.value === 'auto') {
          applyTheme('auto')
        }
      }
      mediaQuery.addEventListener('change', handleChange)
      mediaListenerAttached = true
    }
  }

  initialized = true
}

export function useTheme() {
  initTheme()

  const setTheme = (theme: Theme) => {
    applyTheme(theme)
    setStoredTheme(theme)
  }

  const toggleTheme = () => {
    const newTheme = effectiveTheme.value === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }

  return {
    currentTheme: computed(() => currentTheme.value),
    effectiveTheme: computed(() => effectiveTheme.value),
    setTheme,
    toggleTheme,
  }
}
