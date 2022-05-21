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
  pb: 4,
  fontSize: { base: 'xl', sm: '2xl' },
  textAlign: 'center'
} as const

export const body = {
  mx: { base: 8, sm: 16 }
} as const

export const actions = {
  spacing: 3
} as const
