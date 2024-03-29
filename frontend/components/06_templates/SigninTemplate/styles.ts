import { PresenterProps } from './index'

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
  mt: '-8%',
  mx: 'auto',
  py: 12,
  px: 6
} as const

export const wave = {
  topColor: 'gray.100',
  bottomColor: 'gray.50',
  animationNegativeDelay: 2
} as const

export const logo = {
  mb: 1,
  fontSize: { base: '6xl', sm: '5rem' }
}

export const linkLabel = {
  fontSize: 'lg',
  color: 'gray.600'
}

export const link = ({ disabled }: Pick<PresenterProps, 'disabled'>): Record<string, unknown> =>
  ({
    ml: '3',
    color: disabled ? 'gray.300' : 'blue.400',
    pointerEvents: disabled ? 'none' : 'auto'
  } as const)
