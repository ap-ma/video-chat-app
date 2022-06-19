import { hasValue } from 'utils/general/object'
import { PresenterProps } from './index'

export const root = ({ active }: Pick<PresenterProps, 'active'>): Record<string, unknown> =>
  ({
    align: 'center',
    py: '4',
    px: '3',
    marginStart: '1',
    borderRadius: 'lg',
    bg: active ? 'gray.200' : 'white',
    cursor: active ? 'auto' : 'pointer',
    pointerEvents: active ? 'none' : 'auto',
    _hover: { bg: 'gray.100' }
  } as const)

export const name = {
  fontWeight: 'bold',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis'
} as const

export const content = {
  fontSize: 'sm',
  color: 'gray.600',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis'
} as const

export const count = ({ count }: Pick<PresenterProps, 'count'>) =>
  ({
    color: 'white',
    bg: 'blue.400',
    ml: 'auto',
    mr: '0.2rem',
    py: '1px',
    px: '7.5px',
    fontSize: 'sm',
    borderRadius: '50%',
    d: hasValue(count) && count !== '0' ? 'block' : 'none'
  } as const)
