export const container = {
  overflow: 'hidden',
  minH: '100vh',
  align: 'center',
  justify: 'center',
  py: 12,
  bg: 'gray.50'
} as const

export const segment = {
  minW: { base: '80vw', md: '680px' },
  spacing: 10,
  align: 'center',
  boxShadow: { base: 'md', md: '2xl' },
  rounded: 'xl',
  p: 10,
  pt: 7,
  mt: '-10%',
  bg: 'white'
}

export const icon = {
  w: 16,
  h: 16,
  color: 'red.500'
} as const

export const head = {
  fontSize: '3xl',
  color: 'gray.800'
} as const

export const text = {
  fontSize: 'xl',
  color: 'gray.500'
} as const
