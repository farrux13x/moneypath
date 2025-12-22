import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Input from './Input.vue'

describe('Input', () => {
  it('emits update when typing', async () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: '',
        label: 'Name',
      },
    })

    const input = wrapper.find('input')
    await input.setValue('Alex')

    expect(wrapper.emitted('update:modelValue')).toEqual([['Alex']])
  })

  it('renders empty string for null modelValue', () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: null,
      },
    })

    const input = wrapper.find('input')
    expect((input.element as HTMLInputElement).value).toBe('')
  })
})
