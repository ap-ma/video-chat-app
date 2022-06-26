import { PresenterProps } from './index'
import { PresenterProps as UsualMsgPresenterProps } from './UsualMsg'

export const root = {
  p: '4'
} as const

export const date = ({ isDate }: Pick<PresenterProps, 'isDate'>) =>
  ({
    d: isDate ? 'block' : 'none',
    bg: 'white',
    textAlign: 'center',
    color: 'gray.500',
    fontSize: 'sm',
    fontWeight: '500',
    letterSpacing: '0.5px',
    pos: 'relative',
    _before: { content: '""', h: '0.1px', w: '30%', bg: 'gray.300', pos: 'absolute', top: '50%', left: '3%' },
    _after: { content: '""', h: '0.1px', w: '30%', bg: 'gray.300', pos: 'absolute', top: '50%', right: '3%' }
  } as const)

export const workflow = ({ isWorkflow }: Pick<PresenterProps, 'isWorkflow'>) =>
  ({
    d: isWorkflow ? 'block' : 'none',
    tailPosition: 'none',
    mx: { base: 10, xl: '15%' },
    color: 'gray.600',
    fontWeight: '600',
    bg: 'green.100',
    textAlign: 'center'
  } as const)

export const usualMsg = ({ isMessage }: Pick<PresenterProps, 'isMessage'>) =>
  ({
    d: isMessage ? 'flex' : 'none'
  } as const)

export const showcase = ({ isSender, isImage }: Pick<UsualMsgPresenterProps, 'isSender' | 'isImage'>) =>
  ({
    messagePosition: isSender ? 'right' : 'left',
    balloon: {
      bgColor: isSender ? (isImage ? 'blue.200' : 'blue.300') : 'blackAlpha.100',
      cursor: isSender ? 'pointer' : 'auto'
    }
  } as const)

export const textMsg = ({ isText, isSender }: Pick<UsualMsgPresenterProps, 'isText' | 'isSender'>) =>
  ({
    d: isText ? 'inline-block' : 'none',
    color: isSender ? 'white' : 'black',
    fontSize: 'sm',
    whiteSpace: 'pre-wrap'
  } as const)

export const imageMsg = ({ isImage }: Pick<UsualMsgPresenterProps, 'isImage'>) =>
  ({
    d: isImage ? 'block' : 'none',
    p: 3
  } as const)

export const image = {
  borderStyle: 'solid',
  borderWidth: '1px',
  borderColor: 'gray.300'
} as const

export const callMsg = ({ isCall }: Pick<UsualMsgPresenterProps, 'isCall'>) =>
  ({
    d: isCall ? 'flex' : 'none',
    alignItems: 'center',
    spacing: 2
  } as const)

export const callInfo = {
  whiteSpace: 'pre-wrap',
  fontSize: 'xs',
  fontWeight: '600'
} as const
