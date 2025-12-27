import { useI18n } from '@/shared/i18n'

export function useProfilePage() {
  const { t } = useI18n()

  return {
    t,
  }
}
