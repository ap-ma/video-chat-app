export const root = {
  size: 'md',
  closeOnOverlayClick: false,
  trapFocus: false
} as const

export const overlay = {
  bg: 'blackAlpha.700',
  backdropFilter: 'blur(10px)'
} as const

export const content = {
  top: { base: 0, sm: '15vh' }
} as const

export const header = {
  pb: 4,
  fontSize: { base: 'xl', sm: '2xl' },
  textAlign: 'center'
} as const

export const body = {
  alignSelf: 'center',
  textAlign: 'center',
  mb: 1
} as const

export const actions = {
  justifyContent: 'center',
  spacing: 3,
  mt: 6,
  mb: 1,
  mx: 'auto',
  w: { base: '200px', sm: '200px' },
  direction: { base: 'column', sm: 'row' }
} as const
