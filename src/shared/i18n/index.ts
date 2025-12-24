import { ref, watch } from 'vue'
import en from './en.json'
import ru from './ru.json'
import uz from './uz.json'

const LOCALE_KEY = 'appLocale'

const messages = {
  en,
  ru,
  uz,
} as const

export type Locale = keyof typeof messages

const locales = Object.keys(messages) as Locale[]

const getInitialLocale = (): Locale => {
  const stored = localStorage.getItem(LOCALE_KEY) as Locale | null
  if (stored && locales.includes(stored)) return stored

  const browserLocale = navigator.language.toLowerCase()
  if (browserLocale.startsWith('ru')) return 'ru'
  if (browserLocale.startsWith('uz')) return 'uz'
  return 'en'
}

const locale = ref<Locale>(getInitialLocale())

watch(locale, (nextLocale) => {
  localStorage.setItem(LOCALE_KEY, nextLocale)
})

const resolveMessage = (key: string, messageSet: Record<string, unknown>) => {
  return key
    .split('.')
    .reduce<unknown>((acc, part) => (acc ? (acc as Record<string, unknown>)[part] : undefined), messageSet)
}

const interpolate = (message: string, params?: Record<string, string | number>) => {
  if (!params) return message
  return message.replace(/\{(\w+)\}/g, (_, token) => {
    const value = params[token]
    return value === undefined ? `{${token}}` : String(value)
  })
}

const t = (key: string, params?: Record<string, string | number>) => {
  const messageSet = messages[locale.value] as Record<string, unknown>
  const resolved = resolveMessage(key, messageSet)
  if (typeof resolved !== 'string') return key
  return interpolate(resolved, params)
}

export const useI18n = () => ({
  t,
  locale,
  locales,
})
