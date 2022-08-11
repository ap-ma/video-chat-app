import { PresenterProps } from './index'

export const input = ({ isEditable }: Pick<PresenterProps, 'isEditable'>): Record<string, unknown> =>
  ({
    borderColor: isEditable ? 'inherit' : 'transparent',
    focusBorderColor: isEditable ? '#3182ce' : 'transparent',
    _hover: { borderColor: isEditable ? 'gray.300' : 'transparent' },
    readOnly: !isEditable
  } as const)
