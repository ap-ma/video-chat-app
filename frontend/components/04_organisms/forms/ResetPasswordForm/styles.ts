export const root = {
  w: 'md',
  p: 6,
  spacing: 4,
  bg: 'white',
  rounded: 'lg',
  boxShadow: 'lg'
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
