import { PresenterProps } from './index'

export const root = {
  align: 'center',
  py: '0.7rem',
  px: { base: 3, md: 4 },
  bg: 'gray.50',
  borderBottomWidth: '5px',
  borderBottomStyle: 'double',
  borderBottomColor: 'gray.200'
} as const

export const avatar = ({ loading }: Pick<PresenterProps, 'loading'>) =>
  ({
    d: loading ? 'none' : 'block'
  } as const)

export const userInfo = ({ loading }: Pick<PresenterProps, 'loading'>) =>
  ({
    ml: 4,
    overflow: 'hidden',
    d: loading ? 'none' : 'block'
  } as const)

export const spinner = ({ loading }: Pick<PresenterProps, 'loading'>) =>
  ({
    my: 2,
    ml: 2,
    size: 'lg',
    color: 'gray.500',
    d: loading ? 'inline-block' : 'none'
  } as const)

export const name = {
  fontSize: 'md',
  fontWeight: 'bold',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  lineHeight: 'normal'
} as const

export const comment = {
  fontSize: 'sm',
  color: 'gray.600',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  lineHeight: 'normal'
} as const

export const phoneIcon = {
  size: 'sm',
  fontSize: 'xl',
  color: 'gray.700',
  bg: 'transparent',
  ml: 'auto',
  d: { base: 'inline-flex', md: 'none' },
  _hover: { bg: 'transparent' },
  _focus: { border: 0 }
} as const

export const menuIcon = ({ disabled }: Pick<PresenterProps, 'disabled'>): Record<string, unknown> =>
  ({
    transition: 'all 0.3s',
    size: 'sm',
    fontSize: 'xl',
    ml: { base: 1, md: 'auto' },
    bg: 'transparent',
    color: disabled ? 'gray.400' : 'gray.700',
    disabled,
    _hover: { bg: 'transparent' },
    _focus: { border: 0 }
  } as const)

export const deleteMenu = ({ approved }: Pick<PresenterProps, 'approved'>): Record<string, unknown> =>
  ({
    d: approved ? 'flex' : 'none'
  } as const)

export const undeleteMenu = ({ deleted }: Pick<PresenterProps, 'deleted'>): Record<string, unknown> =>
  ({
    d: deleted ? 'flex' : 'none'
  } as const)

export const blockMenu = ({ notBlocked }: Pick<PresenterProps, 'notBlocked'>): Record<string, unknown> =>
  ({
    d: notBlocked ? 'flex' : 'none'
  } as const)

export const unblockMenu = ({ blocked }: Pick<PresenterProps, 'blocked'>): Record<string, unknown> =>
  ({
    d: blocked ? 'flex' : 'none'
  } as const)
