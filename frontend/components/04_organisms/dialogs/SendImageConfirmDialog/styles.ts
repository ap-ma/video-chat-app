import { PresenterProps } from './index'

export const content = {
  top: { base: 0, sm: '15vh' }
} as const

export const text = ({ isInvalid }: Pick<PresenterProps, 'isInvalid'>): Record<string, unknown> =>
  ({
    textAlign: 'center',
    fontSize: { base: 'md', sm: 'lg' },
    d: isInvalid ? 'none' : 'block'
  } as const)

export const image = ({ isInvalid }: Pick<PresenterProps, 'isInvalid'>): Record<string, unknown> =>
  ({
    mt: 2,
    mx: 'auto',
    borderStyle: 'solid',
    borderWidth: '1px',
    borderColor: 'gray.300',
    d: isInvalid ? 'none' : 'block'
  } as const)

export const actions = {
  pt: 4,
  spacing: { base: 3, sm: 4 },
  direction: { base: 'column', sm: 'row' }
} as const

export const ok = ({ isInvalid }: Pick<PresenterProps, 'isInvalid'>): Record<string, unknown> =>
  ({
    w: 'full',
    bg: 'blue.400',
    color: 'white',
    _hover: { bg: 'blue.500' },
    d: isInvalid ? 'none' : 'inline-flex'
  } as const)
