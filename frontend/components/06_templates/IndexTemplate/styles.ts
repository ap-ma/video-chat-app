import { PresenterProps } from './index'

export const mdSidebar = {
  d: { base: 'none', md: 'block' }
} as const

export const drawer = {
  placement: 'left',
  size: 'full',
  autoFocus: false,
  returnFocusOnClose: false
} as const

export const main = {
  h: 'calc(100vh - var(--chakra-sizes-20))',
  ml: { base: 0, md: 72 },
  flexDirection: 'column'
} as const

export const calling = ({ dispCalling }: Pick<PresenterProps, 'dispCalling'>) =>
  ({
    d: dispCalling ? 'block' : 'none'
  } as const)
