import { useI18n } from '@/shared/i18n'

export function useAddTransactionPage() {
  const { t } = useI18n()

  const goBack = () => {
    window.history.back()
  }

  const handleExpenseAdded = () => {
    // Navigate back to transactions page after adding
    setTimeout(() => {
      window.location.hash = ''
    }, 500)
  }

  return {
    t,
    goBack,
    handleExpenseAdded,
  }
}
