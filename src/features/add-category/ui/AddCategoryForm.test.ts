import { mount } from '@vue/test-utils'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import AddCategoryForm from './AddCategoryForm.vue'

const addCategoryMock = vi.fn()

vi.mock('@/entities/category/model/useCategories', () => ({
  useCategories: () => ({
    addCategory: addCategoryMock,
  }),
}))

describe('AddCategoryForm', () => {
  beforeEach(() => {
    addCategoryMock.mockClear()
  })

  it('shows a validation error when name is empty', async () => {
    const wrapper = mount(AddCategoryForm)

    await wrapper.find('form').trigger('submit')

    expect(addCategoryMock).not.toHaveBeenCalled()
    expect(wrapper.text()).toContain('Please enter a category name')
  })

  it('normalizes invalid color input before submitting', async () => {
    const wrapper = mount(AddCategoryForm)

    await wrapper.find('input[placeholder="e.g., Groceries"]').setValue('Pets')
    await wrapper.find('input[placeholder="#000000"]').setValue('invalid')
    await wrapper.find('form').trigger('submit')

    expect(addCategoryMock).toHaveBeenCalledWith({
      name: 'Pets',
      color: '#2f7f7b',
    })
  })
})
