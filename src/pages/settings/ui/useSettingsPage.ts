import { useI18n } from '@/shared/i18n'

export function useSettingsPage() {
  const { t, locale, locales } = useI18n()

  const goToProfile = () => {
    window.location.hash = 'profile'
  }

  const goToExport = () => {
    window.location.hash = 'export'
  }

  const goToCategories = () => {
    window.location.hash = 'categories'
  }

  return {
    t,
    locale,
    locales,
    goToProfile,
    goToExport,
    goToCategories,
  }
}
