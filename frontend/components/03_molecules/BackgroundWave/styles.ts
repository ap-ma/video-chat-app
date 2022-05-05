import { BackgroundWaveProps } from './index'

export const container = ({
  bottomColor
}: Pick<BackgroundWaveProps, 'bottomColor'>): Record<string, unknown> =>
  ({
    h: '100vh',
    mt: '-100vh',
    pos: 'relative',
    zIndex: -1,
    bg: bottomColor
  } as const)

export const top = ({ topColor }: Pick<BackgroundWaveProps, 'topColor'>): Record<string, unknown> =>
  ({
    h: '45vh',
    bg: topColor
  } as const)
