export interface User {
  id: string
  name: string
  email: string
  currency: string
  dateFormat: string
  theme: 'light' | 'dark' | 'auto'
  createdAt: string
  updatedAt: string
}

export const DEFAULT_CURRENCY = 'USD'
export const DEFAULT_DATE_FORMAT = 'MM/DD/YYYY'
export const DEFAULT_THEME: 'light' | 'dark' | 'auto' = 'light'


