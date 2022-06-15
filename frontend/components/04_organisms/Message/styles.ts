import { PresenterProps } from './index'

export const root = ({ isSender }: Pick<PresenterProps, 'isSender'>) =>
  ({
    justifyContent: isSender ? 'end' : 'start'
  } as const)

export const container = ({ isSender }: Pick<PresenterProps, 'isSender'>) =>
  ({
    p: '3',
    maxW: '60%',
    flexDirection: isSender ? 'row-reverse' : 'row'
  } as const)

export const content = ({ isSender }: Pick<PresenterProps, 'isSender'>) =>
  ({
    ml: isSender ? 0 : 3.5,
    mr: isSender ? 3.5 : 0
  } as const)

export const balloon = ({ isSender }: Pick<PresenterProps, 'isSender'>) =>
  ({
    autoSizing: true,
    tailPosition: isSender ? 'right' : 'left',
    bgColor: isSender ? '#389fff' : 'blackAlpha.200'
  } as const)

export const textContent = ({ isSender }: Pick<PresenterProps, 'isSender'>) =>
  ({
    color: isSender ? 'white' : 'black',
    fontSize: 'sm',
    whiteSpace: 'pre-wrap'
  } as const)

export const info = ({ isSender }: Pick<PresenterProps, 'isSender'>) =>
  ({
    direction: 'column',
    mt: 'auto',
    ml: isSender ? 0 : 2,
    mr: isSender ? 2 : 0
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
