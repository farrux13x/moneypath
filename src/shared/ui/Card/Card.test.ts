import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Card from './Card.vue'

describe('Card', () => {
  it('renders slot content', () => {
    const wrapper = mount(Card, {
      slots: {
        default: '<span>Content</span>',
      },
    })

    expect(wrapper.text()).toContain('Content')
  })

  it('omits padded class when padded is false', () => {
    const wrapper = mount(Card, {
      props: {
        padded: false,
      },
    })

    expect(wrapper.classes()).toContain('card')
    expect(wrapper.classes()).not.toContain('card--padded')
  })
})
