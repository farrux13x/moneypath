import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('useCategories', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
    vi.resetModules()
  })

  it('loads default categories when storage is empty', async () => {
    const { useCategories } = await import('./useCategories')
    const { categories } = useCategories()

    expect(categories.value.length).toBeGreaterThan(0)
    expect(categories.value.some((cat) => cat.id === 'food')).toBe(true)
  })

  it('adds and removes categories', async () => {
    const { useCategories } = await import('./useCategories')
    const { categories, addCategory, removeCategory } = useCategories()

    const initialCount = categories.value.length
    addCategory({ name: 'Pets', color: '#123456' })

    expect(categories.value.length).toBe(initialCount + 1)

    const added = categories.value[categories.value.length - 1]
    removeCategory(added.id)

    expect(categories.value.length).toBe(initialCount)
  })
})
