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

export const title = {
  color: 'blue.400',
  textShadow: '0.7px 0.7px 2px #384b6e',
  fontSize: { base: '5xl', sm: '7xl' },
  mb: { base: '1', sm: '3' }
}

export const head = {
  fontSize: { base: '1.7rem', sm: '4xl' }
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
