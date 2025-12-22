import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ColorPicker from './ColorPicker.vue'

describe('ColorPicker', () => {
  it('emits updates from both inputs', async () => {
    const wrapper = mount(ColorPicker, {
      props: {
        modelValue: '#000000',
      },
    })

    const [colorInput, textInput] = wrapper.findAll('input')

    await colorInput.setValue('#ff0000')
    await textInput.setValue('#00ff00')

    expect(wrapper.emitted('update:modelValue')).toEqual([
      ['#ff0000'],
      ['#00ff00'],
    ])
  })
})
