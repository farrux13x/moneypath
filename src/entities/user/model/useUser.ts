import { ref, computed } from 'vue'
import type { User } from './types'
import { DEFAULT_CURRENCY, DEFAULT_DATE_FORMAT } from './types'

const user = ref<User | null>(null)

export function useUser() {
  const sanitizeUser = (raw: User & { theme?: unknown }): User => {
    const { theme, ...rest } = raw
    return rest
  }

  const createUser = (
    userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
  ) => {
    const now = new Date().toISOString()
    const newUser: User = {
      ...userData,
      id: 'user-' + Date.now().toString(),
      createdAt: now,
      updatedAt: now,
    }
    user.value = newUser
    saveUser()
    return newUser
  }

  const updateUser = (updates: Partial<Omit<User, 'id' | 'createdAt'>>) => {
    if (!user.value) {
      // Create default user if none exists
      createUser({
        name: 'User',
        email: '',
        currency: DEFAULT_CURRENCY,
        dateFormat: DEFAULT_DATE_FORMAT,
      })
    }

    if (user.value) {
      user.value = {
        ...user.value,
        ...updates,
        updatedAt: new Date().toISOString(),
      }
      saveUser()
    }
  }

  const saveUser = () => {
    if (user.value) {
      localStorage.setItem('user', JSON.stringify(user.value))
    }
  }

  const loadUser = () => {
    const stored = localStorage.getItem('user')
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as User & { theme?: unknown }
        user.value = sanitizeUser(parsed)
        if (Object.prototype.hasOwnProperty.call(parsed, 'theme')) {
          saveUser()
        }
      } catch (e) {
        console.error('Failed to load user from localStorage', e)
        user.value = null
      }
    }
  }

  const clearUser = () => {
    user.value = null
    localStorage.removeItem('user')
  }

  // Initialize
  loadUser()

  // Create default user if none exists
  if (!user.value) {
    createUser({
      name: 'User',
      email: '',
      currency: DEFAULT_CURRENCY,
      dateFormat: DEFAULT_DATE_FORMAT,
    })
  }

  return {
    user: computed(() => user.value),
    updateUser,
    clearUser,
  }
}
