import { ref, computed } from 'vue'
import type { Category } from './types'

// Default categories
const defaultCategories: Category[] = [
  { id: 'food', name: 'Food & Dining', color: '#ef4444' },
  { id: 'transport', name: 'Transportation', color: '#3b82f6' },
  { id: 'shopping', name: 'Shopping', color: '#8b5cf6' },
  { id: 'bills', name: 'Bills & Utilities', color: '#f59e0b' },
  { id: 'entertainment', name: 'Entertainment', color: '#ec4899' },
  { id: 'health', name: 'Health & Fitness', color: '#10b981' },
  { id: 'education', name: 'Education', color: '#6366f1' },
  { id: 'other', name: 'Other', color: '#6b7280' }
]

const categories = ref<Category[]>([])

export function useCategories() {
  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    }
    categories.value.push(newCategory)
    saveCategories()
  }

  const removeCategory = (id: string) => {
    categories.value = categories.value.filter(cat => cat.id !== id)
    saveCategories()
  }

  const updateCategory = (id: string, updates: Partial<Category>) => {
    const index = categories.value.findIndex(cat => cat.id === id)
    if (index !== -1) {
      categories.value[index] = { ...categories.value[index], ...updates }
      saveCategories()
    }
  }

  const getCategoryById = (id: string): Category | undefined => {
    return categories.value.find(cat => cat.id === id)
  }

  const importCategory = (category: Category) => {
    // Check if category with this ID already exists
    const existingIndex = categories.value.findIndex(cat => cat.id === category.id)
    if (existingIndex !== -1) {
      categories.value[existingIndex] = category
    } else {
      categories.value.push(category)
    }
    saveCategories()
  }

  const clearAllCategories = () => {
    categories.value = [...defaultCategories]
    saveCategories()
  }

  const saveCategories = () => {
    localStorage.setItem('categories', JSON.stringify(categories.value))
  }

  const loadCategories = () => {
    const stored = localStorage.getItem('categories')
    if (stored) {
      try {
        categories.value = JSON.parse(stored)
      } catch (e) {
        console.error('Failed to load categories from localStorage', e)
        categories.value = [...defaultCategories]
      }
    } else {
      categories.value = [...defaultCategories]
    }
  }

  // Initialize
  loadCategories()

  return {
    categories: computed(() => categories.value),
    addCategory,
    removeCategory,
    updateCategory,
    getCategoryById,
    importCategory,
    clearAllCategories
  }
}

