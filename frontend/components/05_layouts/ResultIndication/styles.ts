export const root = {
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
