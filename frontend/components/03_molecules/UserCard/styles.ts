export const container = {
  w: 80,
  p: 6,
  bg: 'gray.100',
  rounded: 'lg',
  border: '1px',
  borderColor: 'gray.200',
  boxShadow: 'xl',
  textAlign: 'center'
} as const

export const avatar = {
  pos: 'relative',
  mb: 4,
  size: 'xl'
} as const

export const name = {
  fontSize: '2xl',
  mb: 0.5
} as const

export const note = {
  fontWeight: 'medium',
  color: 'gray.500',
  mb: 4
} as const

export const button = {
  w: '60%',
  bg: 'blue.400',
  color: 'white',
  fontSize: 'sm',
  rounded: 'lg',
  boxShadow: '0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)',
  _hover: { bg: 'blue.500' },
  _focus: { bg: 'blue.500' }
} as const
