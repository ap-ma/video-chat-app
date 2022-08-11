export const head = {
  textAlign: 'center',
  fontSize: { base: 'xl', md: '2xl' }
} as const

export const text = {
  fontSize: { base: 'sm', sm: 'md' }
} as const

export const button = {
  w: { base: 'full', sm: '20' },
  bg: 'blue.400',
  color: 'white',
  _hover: { bg: 'blue.500' }
} as const
