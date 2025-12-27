import { ref } from 'vue'
import type { Expense } from '@/entities/expense/model/types'
import { useI18n } from '@/shared/i18n'

export function useHomePage() {
  const { t } = useI18n()

  const searchResults = ref<Expense[]>([])
  const showSearchResults = ref(false)
  const showSearch = ref(false)

  const handleSearchResults = (results: Expense[]) => {
    searchResults.value = results
  }

  const handleFiltersActive = (active: boolean) => {
    showSearchResults.value = active
  }

  const handleExpenseClick = (expense: Expense) => {
    // Handle expense click if needed (e.g., show details, edit)
    console.log('Expense clicked:', expense)
  }

  const goToAddTransaction = () => {
    window.location.hash = 'add-transaction'
  }

  return {
    t,
    searchResults,
    showSearchResults,
    showSearch,
    handleSearchResults,
    handleFiltersActive,
    handleExpenseClick,
    goToAddTransaction,
  }
}
