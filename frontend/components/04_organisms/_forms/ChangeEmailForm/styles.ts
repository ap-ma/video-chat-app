import { PresenterProps } from './index'

export const content = {
  top: { base: 0, sm: '15vh' }
} as const

export const head = {
  lineHeight: 1.1,
  pb: 3,
  fontSize: { base: 'xl', sm: '2xl' }
} as const

export const currentLabel = {
  mb: '2',
  fontWeight: 'var(--chakra-fontWeights-medium)'
} as const

export const currentText = ({ me: { loading } }: Pick<PresenterProps['query'], 'me'>): Record<string, unknown> =>
  ({
    ml: '3',
    d: loading ? 'none' : 'block'
  } as const)

export const currentSpinner = ({ me: { loading } }: Pick<PresenterProps['query'], 'me'>): Record<string, unknown> =>
  ({
    ml: '4',
    size: 'sm',
    color: 'gray.400',
    d: loading ? 'inline-block' : 'none'
  } as const)

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
