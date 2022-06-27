import { PresenterProps as HeaderPresenterProps } from './Header'

export const spinner = ({ context }: Pick<HeaderPresenterProps, 'context'>): Record<string, unknown> =>
  ({
    pt: '5',
    textAlign: 'center',
    d: context?.loading ? 'block' : 'none'
  } as const)
