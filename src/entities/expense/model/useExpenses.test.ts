import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('useExpenses', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
    vi.resetModules()
  })

  it('adds expenses and computes totals by category and month', async () => {
    const { useExpenses } = await import('./useExpenses')
    const { addExpense, totalAmount, expensesByCategory, monthlyExpenses } =
      useExpenses()

    addExpense({
      amount: 10,
      category: 'food',
      date: '2024-03-10',
      description: 'Lunch',
    })
    addExpense({
      amount: 20,
      category: 'food',
      date: '2024-03-11',
      description: 'Dinner',
    })

    expect(totalAmount.value).toBe(30)
    expect(expensesByCategory.value.food).toBe(30)
    expect(monthlyExpenses.value['2024-03']).toBe(30)
  })

  it('imports expenses by id and replaces existing entries', async () => {
    const { useExpenses } = await import('./useExpenses')
    const { importExpense, expenses } = useExpenses()

    importExpense({
      id: 'exp-1',
      amount: 12,
      category: 'bills',
      date: '2024-02-01',
      description: 'Internet',
    })

    importExpense({
      id: 'exp-1',
      amount: 18,
      category: 'bills',
      date: '2024-02-01',
      description: 'Internet updated',
    })

    expect(expenses.value).toHaveLength(1)
    expect(expenses.value[0].amount).toBe(18)
  })

  it('clears all expenses', async () => {
    const { useExpenses } = await import('./useExpenses')
    const { addExpense, clearAllExpenses, expenses } = useExpenses()

    addExpense({
      amount: 5,
      category: 'other',
      date: '2024-01-05',
      description: 'Snack',
    })
    clearAllExpenses()

    expect(expenses.value).toHaveLength(0)
  })
})
