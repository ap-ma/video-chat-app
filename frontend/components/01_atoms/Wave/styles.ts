import { css, keyframes } from '@emotion/css'
import { PresenterProps } from './index'

export const waveBorder = ({ bottomColor }: Pick<PresenterProps, 'bottomColor'>): Record<string, unknown> =>
  ({
    xmlns: 'http://www.w3.org/2000/svg',
    xmlnsXlink: 'http://www.w3.org/1999/xlink',
    color: bottomColor,
    d: 'inherit',
    pos: 'relative',
    lineHeight: 'normal',
    flexShrink: 1,
    verticalAlign: 'baseline',
    viewBox: '0 24 150 28',
    w: '100%',
    mb: '-7',
    h: '7vw',
    minH: '7vw',
    preserveAspectRatio: 'none',
    shapeRendering: 'auto'
  } as const)

const moveForever = keyframes`
  from { transform: translate3d(-90px, 0, 0) }
  to { transform: translate3d(85px, 0, 0) }
`

export const parallax = ({ animationNegativeDelay }: Pick<PresenterProps, 'animationNegativeDelay'>): string => css`
  & > use {
    animation: ${moveForever} 4s cubic-bezier(0.62, 0.5, 0.38, 0.5) infinite;
    animation-delay: -${animationNegativeDelay}s;
  }
`
