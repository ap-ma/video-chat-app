import { UserCardProps } from './index'

export const root = ({ active }: Pick<UserCardProps, 'active'>): Record<string, unknown> =>
  ({
    style: { textDecoration: 'none' },
    pointerEvents: active ? 'none' : 'auto'
  } as const)

export const box = ({ active }: Pick<UserCardProps, 'active'>): Record<string, unknown> =>
  ({
    bgColor: active ? 'gray.200' : 'white',
    align: 'center',
    py: '4',
    px: '3',
    marginStart: '1',
    borderRadius: 'lg',
    role: 'group',
    cursor: 'pointer',
    _hover: {
      bg: 'gray.100'
    }
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
