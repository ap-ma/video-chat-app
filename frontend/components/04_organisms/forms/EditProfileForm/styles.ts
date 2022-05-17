import { PresenterProps } from './index'

export const head = {
  lineHeight: 1.1,
  pb: 1,
  fontSize: { base: '2xl', sm: '3xl' }
} as const

export const identifier = {
  pt: 2,
  spacing: 2,
  direction: { base: 'column', sm: 'row' }
} as const

export const tooltip = ({ edit }: Pick<PresenterProps, 'edit'>): Record<string, unknown> =>
  ({
    placement: 'bottom-start',
    closeOnClick: false,
    isDisabled: !edit
  } as const)

export const input = {
  _placeholder: { color: 'gray.500' },
  _invalid: { backgroundColor: 'red.100' }
} as const

export const actions = {
  pt: '4',
  spacing: 4,
  direction: { base: 'column', sm: 'row' }
} as const

export const editButton = ({ edit }: Pick<PresenterProps, 'edit'>): Record<string, unknown> =>
  ({
    w: 'full',
    bg: 'blue.400',
    color: 'white',
    _hover: { bg: 'blue.500' },
    d: edit ? 'none' : 'inline-flex'
  } as const)

export const cancelButton = ({ edit }: Pick<PresenterProps, 'edit'>): Record<string, unknown> =>
  ({
    w: 'full',
    d: edit ? 'inline-flex' : 'none'
  } as const)

export const saveButton = ({ edit }: Pick<PresenterProps, 'edit'>): Record<string, unknown> =>
  ({
    w: 'full',
    bg: 'blue.400',
    color: 'white',
    _hover: { bg: 'blue.500' },
    d: edit ? 'inline-flex' : 'none'
  } as const)
