export const root = {
  h: 20,
  ml: { base: 0, md: 72 },
  pl: 4,
  pr: { base: 5, md: 4 },
  bg: 'gray.50',
  borderBottomWidth: '1px',
  borderBottomColor: 'gray.200',
  alignItems: 'center',
  justifyContent: { base: 'space-between', md: 'flex-end' }
} as const

export const openButton = {
  'aria-label': 'open menu',
  variant: 'outline',
  mr: { base: '5', md: '2' },
  d: { base: 'flex', md: 'none' }
} as const

export const logo = {
  d: { base: 'flex', md: 'none' }
} as const

export const rightContents = {
  spacing: { base: '2', md: '6' }
} as const

export const searchButton = {
  'aria-label': 'open menu',
  variant: 'ghost',
  size: 'lg'
} as const
