export const root = {
  h: '100%',
  justifyContent: 'center',
  alignItems: 'center'
} as const

export const segment = {
  mt: '-2%',
  pt: 7,
  pb: 6,
  w: { base: '90%', md: '450px', lg: '550px' },
  align: 'center',
  spacing: 5,
  rounded: '2xl',
  bg: 'blackAlpha.50',
  boxShadow: { base: 'md', md: 'xl' },
  borderWidth: '1px',
  borderColor: 'gray.200'
}

export const icon = {
  w: 16,
  h: 16,
  color: 'blue.400'
} as const

export const body = {
  align: 'center',
  textAlign: 'center',
  spacing: 5
} as const

export const button = {
  bg: 'blue.400',
  color: 'white',
  _hover: { bg: 'blue.500' }
} as const
