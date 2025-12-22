import { describe, it, expect, beforeEach, vi } from 'vitest'
import { DEFAULT_CURRENCY, DEFAULT_DATE_FORMAT, DEFAULT_THEME } from './types'

describe('useUser', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
    vi.resetModules()
  })

  it('creates a default user on initialization', async () => {
    const { useUser } = await import('./useUser')
    const { user } = useUser()

    expect(user.value).not.toBeNull()
    expect(user.value?.currency).toBe(DEFAULT_CURRENCY)
    expect(user.value?.dateFormat).toBe(DEFAULT_DATE_FORMAT)
    expect(user.value?.theme).toBe(DEFAULT_THEME)
  })

  it('updates user fields and persists them', async () => {
    const { useUser } = await import('./useUser')
    const { user, updateUser } = useUser()

    updateUser({ name: 'Sam', email: 'sam@example.com' })

    expect(user.value?.name).toBe('Sam')
    expect(user.value?.email).toBe('sam@example.com')

    const stored = localStorage.getItem('user')
    expect(stored).not.toBeNull()
    expect(JSON.parse(stored as string).name).toBe('Sam')
  })
})
