import { PresenterProps } from './index'

export const trigger = {
  py: 2,
  transition: 'all 0.3s',
  _focus: { boxShadow: 'none' }
} as const

export const avatar = {
  size: 'sm'
} as const

export const userInfo = {
  spacing: '0',
  alignItems: 'flex-start',
  d: { base: 'none', md: 'flex' }
} as const

export const name = {
  fontSize: 'xs'
} as const

export const code = {
  fontSize: 'xs',
  color: 'gray.600'
} as const

export const arrow = {
  d: { base: 'none', md: 'flex' }
} as const

export const list = {
  bg: 'white',
  borderColor: 'gray.200'
} as const

export const signOutText = ({ loading }: Pick<PresenterProps, 'loading'>): Record<string, unknown> =>
  ({
    d: !loading ? 'block' : 'none'
  } as const)

export const signOutSpinner = ({ loading }: Pick<PresenterProps, 'loading'>): Record<string, unknown> =>
  ({
    size: 'sm',
    d: loading ? 'inline-block' : 'none'
  } as const)
