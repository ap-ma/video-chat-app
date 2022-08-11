import { PresenterProps } from './index'

export const container = {
  direction: { base: 'column', sm: 'row' },
  spacing: 6
} as const

export const badge = ({ isDisabled }: Pick<PresenterProps, 'isDisabled'>): Record<string, unknown> =>
  ({
    size: 'sm',
    rounded: 'full',
    top: '-10px',
    colorScheme: 'red',
    d: isDisabled ? 'none' : 'flex',
    'aria-label': 'remove Image'
  } as const)

export const fileInput = (acceptImageExts: string[]): Record<string, unknown> =>
  ({
    type: 'file',
    accept: acceptImageExts.map((ext) => `image/${ext}`).join(', '),
    hidden: true
  } as const)
