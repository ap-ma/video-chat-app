import { PresenterProps } from './index'

export const chat = ({ chatDisp }: Pick<PresenterProps, 'chatDisp'>): Record<string, unknown> =>
  ({
    d: chatDisp ? 'block' : 'none'
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
