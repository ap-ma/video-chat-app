import { MutaionLoading } from 'types'

export const container = {
  overflow: 'hidden',
  align: 'center',
  justify: 'center',
  minH: '100vh'
} as const

export const contents = {
  spacing: 8,
  minW: { base: 'full', sm: 'md' },
  maxW: 'lg',
  mt: '-10%',
  mx: 'auto',
  py: 12,
  px: 6
} as const

export const wave = {
  topColor: 'gray.100',
  bottomColor: 'gray.50',
  animationNegativeDelay: 2
} as const

export const head = {
  fontSize: { base: '1.7rem', sm: '4xl' }
}

export const linkLabel = {
  fontSize: 'lg',
  color: 'gray.600'
}

export const link = (loading: MutaionLoading): Record<string, unknown> =>
  ({
    ml: '3',
    color: loading ? 'gray.300' : 'blue.400',
    pointerEvents: loading ? 'none' : 'auto'
  } as const)
