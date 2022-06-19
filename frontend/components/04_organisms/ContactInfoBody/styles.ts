import { PresenterProps } from './index'

export const messageList = ({ messageListDisp }: Pick<PresenterProps, 'messageListDisp'>): Record<string, unknown> =>
  ({
    display: messageListDisp ? 'block' : 'none'
  } as const)

export const applyContactBox = ({ applyBoxDisp }: Pick<PresenterProps, 'applyBoxDisp'>): Record<string, unknown> =>
  ({
    d: applyBoxDisp ? 'flex' : 'none'
  } as const)

export const approveContactBox = ({
  approveBoxDisp
}: Pick<PresenterProps, 'approveBoxDisp'>): Record<string, unknown> =>
  ({
    d: approveBoxDisp ? 'flex' : 'none'
  } as const)

export const unblockContactBox = ({
  unblockBoxDisp
}: Pick<PresenterProps, 'unblockBoxDisp'>): Record<string, unknown> =>
  ({
    d: unblockBoxDisp ? 'flex' : 'none'
  } as const)
