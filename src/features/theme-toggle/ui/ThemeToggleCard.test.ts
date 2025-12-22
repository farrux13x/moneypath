import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import ThemeToggleCard from './ThemeToggleCard.vue'

const setThemeMock = vi.fn()
const currentTheme = ref('light')

vi.mock('@/shared/lib/theme/useTheme', () => ({
  useTheme: () => ({
    currentTheme,
    setTheme: setThemeMock,
  }),
}))

describe('ThemeToggleCard', () => {
  it('calls setTheme when a theme option is selected', async () => {
    const wrapper = mount(ThemeToggleCard)

    const darkButton = wrapper.findAll('button').find((button) => {
      return button.text().includes('Dark')
    })

    expect(darkButton).toBeTruthy()

    await darkButton!.trigger('click')

    expect(setThemeMock).toHaveBeenCalledWith('dark')
  })
})
