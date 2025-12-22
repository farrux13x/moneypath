import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Button from './Button.vue'

describe('Button', () => {
  it('applies variant, size, and full width classes', () => {
    const wrapper = mount(Button, {
      props: {
        variant: 'danger',
        size: 'lg',
        fullWidth: true,
      },
      slots: {
        default: 'Delete',
      },
    })

    const classes = wrapper.classes()
    expect(classes).toContain('button')
    expect(classes).toContain('button--danger')
    expect(classes).toContain('button--lg')
    expect(classes).toContain('button--full-width')
  })

  it('emits click event', async () => {
    const wrapper = mount(Button, {
      slots: {
        default: 'Click',
      },
    })

    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toHaveLength(1)
  })
})
