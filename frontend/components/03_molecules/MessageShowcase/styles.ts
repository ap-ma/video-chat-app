import { PresenterProps } from './index'

export const root = ({ isLeftAligned }: Pick<PresenterProps, 'isLeftAligned'>) =>
  ({
    justifyContent: isLeftAligned ? 'start' : 'end'
  } as const)

export const container = ({ isLeftAligned }: Pick<PresenterProps, 'isLeftAligned'>) =>
  ({
    maxW: { base: 'full', md: '60%' },
    flexDirection: isLeftAligned ? 'row' : 'row-reverse'
  } as const)

export const content = ({ isLeftAligned }: Pick<PresenterProps, 'isLeftAligned'>) =>
  ({
    ml: isLeftAligned ? 4 : 0,
    mr: isLeftAligned ? 0 : 4
  } as const)

export const balloon = ({ balloon, isLeftAligned }: Pick<PresenterProps, 'isLeftAligned' | 'balloon'>) =>
  ({
    ...balloon,
    autoSizing: true,
    tailPosition: isLeftAligned ? 'left' : 'right'
  } as const)

export const info = ({ isLeftAligned }: Pick<PresenterProps, 'isLeftAligned'>) =>
  ({
    direction: 'column',
    mt: 'auto',
    ml: isLeftAligned ? 2 : 0,
    mr: isLeftAligned ? 0 : 2
  } as const)

export const read = ({ isRead }: Pick<PresenterProps, 'isRead'>) =>
  ({
    ...infoText,
    d: isRead ? 'block' : 'none'
  } as const)

export const infoText = {
  fontSize: 'xs',
  lineHeight: 'normal',
  color: 'gray.500'
} as const
