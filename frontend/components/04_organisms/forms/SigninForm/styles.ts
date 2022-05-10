import { MutaionLoading } from 'types'

export const root = {
  spacing: 4,
  p: 8,
  bg: 'white',
  rounded: 'lg',
  boxShadow: 'lg'
} as const

export const input = {
  _placeholder: { color: 'gray.500' },
  _invalid: { backgroundColor: 'red.100' }
} as const

export const options = {
  direction: { base: 'column', sm: 'row' },
  align: 'start',
  justify: 'space-between'
} as const

export const link = (loading: MutaionLoading): Record<string, unknown> =>
  ({
    color: loading ? 'gray.300' : 'blue.400',
    pointerEvents: loading ? 'none' : 'auto'
  } as const)

export const signinButton = {
  bg: 'blue.400',
  color: 'white',
  _hover: { bg: 'blue.500' }
} as const
