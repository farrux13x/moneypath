import { useI18n } from '@/shared/i18n'

export function useCategoriesPage() {
  const { t } = useI18n()

  return {
    t,
  }
}
