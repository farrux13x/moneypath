export interface User {
  id: string
  name: string
  email: string
  currency: string
  dateFormat: string
  createdAt: string
  updatedAt: string
}

export const DEFAULT_CURRENCY = 'USD'
export const DEFAULT_DATE_FORMAT = 'MM/DD/YYYY'
