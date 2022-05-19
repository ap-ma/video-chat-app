export const root = {
  size: 'md',
  closeOnOverlayClick: false,
  trapFocus: false
} as const

export const overlay = {
  bg: 'blackAlpha.700',
  backdropFilter: 'blur(10px)'
} as const

export const header = {
  pb: 3,
  mx: { base: 0, sm: 8 },
  fontSize: { base: 'lg', sm: 'xl' }
} as const

export const body = {
  mx: { base: 4, sm: 12 }
} as const

export const actions = {
  spacing: 3
} as const
