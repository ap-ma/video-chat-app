export const content = {
  top: { base: 0, sm: '15vh' }
} as const

export const head = {
  lineHeight: 1.1,
  pb: 3,
  fontSize: { base: '2xl', sm: '3xl' }
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
