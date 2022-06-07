export const head = {
  lineHeight: 1.1,
  pb: 1,
  fontSize: { base: '2xl', sm: '3xl' }
} as const

export const identifier = {
  pt: 2,
  spacing: 2,
  direction: { base: 'column', sm: 'row' }
} as const

export const tooltip = {
  placement: 'bottom-start',
  closeOnClick: false
} as const

export const input = {
  _placeholder: { color: 'gray.500' },
  _invalid: { backgroundColor: 'red.100' }
} as const

export const signupButton = {
  w: 'full',
  bg: 'blue.400',
  color: 'white',
  _hover: { bg: 'blue.500' }
} as const
