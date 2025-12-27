import { useI18n } from '@/shared/i18n'

export function useExportPage() {
  const { t } = useI18n()

  return {
    t,
  }
}
