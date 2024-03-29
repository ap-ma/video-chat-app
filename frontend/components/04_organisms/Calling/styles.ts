export const root = {
  pos: 'absolute',
  zIndex: 1,
  top: 0,
  w: 'full',
  h: 'full',
  bg: 'white'
} as const

export const container = {
  h: 'full',
  p: { base: 10, lg: 20 },
  justifyContent: 'center',
  spacing: { base: 10, sm: 12, md: 16 },
  bg: 'blackAlpha.800'
} as const

export const screen = {
  direction: { base: 'column', sm: 'row' },
  spacing: { base: 10, lg: 16 }
} as const

export const video = {
  w: 'full',
  borderWidth: '1px',
  borderColor: 'black'
} as const

export const actions = {
  justifyContent: 'center',
  spacing: 4
} as const

export const mediaButton = {
  bgColor: 'gray.200',
  boxSize: 16,
  fontSize: '3xl',
  borderRadius: 'full'
} as const

export const hangUpButton = {
  bgColor: 'gray.200',
  color: 'red.600',
  boxSize: 16,
  fontSize: '2xl',
  borderRadius: 'full'
} as const
