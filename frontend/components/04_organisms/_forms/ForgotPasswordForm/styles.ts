export const head = {
  lineHeight: 1.1,
  pb: 1,
  fontSize: { base: 'xl', sm: '2xl' }
} as const

export const text = {
  color: 'gray.800',
  fontSize: { base: 'sm', sm: 'md' }
} as const

export const input = {
  _placeholder: { color: 'gray.500' },
  _invalid: { backgroundColor: 'red.100' }
} as const

export const button = {
  w: 'full',
  bg: 'blue.400',
  color: 'white',
  _hover: { bg: 'blue.500' }
} as const
