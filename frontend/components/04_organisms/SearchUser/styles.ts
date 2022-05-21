import { hasValue } from 'utils/general/object'
import { PresenterProps } from './index'

export const content = {
  top: '4vh',
  rounded: 'lg',
  shadow: 'lg',
  overflow: 'hidden'
} as const

export const input = {
  pl: 3,
  variant: 'flushed',
  autoComplete: 'off',
  autoCorrect: 'off',
  spellCheck: 'false',
  _invalid: {}
} as const

export const search = {
  color: 'blue.500',
  variant: 'ghost',
  _hover: { bg: 'transparent' },
  _focus: { border: 0 },
  'aria-label': 'search'
} as const

export const result = ({ called }: Pick<PresenterProps, 'called'>): Record<string, unknown> =>
  ({
    d: called ? 'block' : 'none'
  } as const)

export const card = ({ result }: Pick<PresenterProps, 'result'>): Record<string, unknown> =>
  ({
    mt: 5,
    mb: 9,
    d: hasValue(result) ? 'flex' : 'none'
  } as const)

export const noResult = ({ result }: Pick<PresenterProps, 'result'>): Record<string, unknown> =>
  ({
    ml: 5,
    mt: 1,
    mb: 4,
    fontSize: 'sm',
    d: hasValue(result) ? 'none' : 'block'
  } as const)
