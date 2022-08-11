import { PresenterProps } from './index'

export const root = ({
  tailPosition,
  bgColor,
  autoSizing
}: Pick<PresenterProps, 'tailPosition' | 'bgColor' | 'autoSizing'>): Record<string, unknown> =>
  ({
    pos: 'relative',
    py: 3,
    px: 4,
    bgColor,
    d: autoSizing ? 'inline-block' : 'block',
    rounded: 'lg',
    boxShadow: 'md',
    _before: {
      content: '""',
      pos: 'absolute',
      w: 0,
      h: 0,
      // top: 'calc(50% - 8px)',
      top: '14px',
      borderTop: '7px solid transparent',
      borderBottom: '2px solid transparent',
      ...tail({ tailPosition, bgColor })
    }
  } as const)

const tail = ({ tailPosition, bgColor }: Pick<PresenterProps, 'tailPosition' | 'bgColor'>): Record<string, unknown> => {
  const result: Record<string, unknown> = {}
  if (tailPosition === 'left') {
    result['left'] = '-8px'
    result['borderRight'] = '8px solid'
    result['borderRightColor'] = bgColor
  }
  if (tailPosition === 'right') {
    result['right'] = '-8px'
    result['borderLeft'] = '8px solid'
    result['borderLeftColor'] = bgColor
  }

  return result
}
