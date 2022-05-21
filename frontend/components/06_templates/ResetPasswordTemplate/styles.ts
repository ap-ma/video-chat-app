export const container = {
  overflow: 'hidden',
  align: 'center',
  justify: 'center',
  minH: '100vh',
  bg: 'gray.50'
} as const

export const contents = {
  spacing: 8,
  w: { base: 'full', sm: 'md' },
  mt: '-8%',
  mx: 'auto',
  py: 12,
  px: 6
} as const

export const head = {
  textAlign: 'center',
  lineHeight: 1.1,
  fontSize: { base: '2xl', md: '3xl' }
} as const
