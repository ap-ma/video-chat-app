import { PresenterProps } from './index'

export const root = ({
  triangleMarkPosition,
  bgColor,
  autoSizing
}: Pick<PresenterProps, 'triangleMarkPosition' | 'bgColor' | 'autoSizing'>): Record<string, unknown> =>
  ({
    pos: 'relative',
    p: 4,
    bgColor,
    d: autoSizing ? 'inline-block' : 'block',
    rounded: 'lg',
    boxShadow: 'md',
    _before: {
      content: '""',
      pos: 'absolute',
      w: 0,
      h: 0,
      // top: '16px',
      top: 'calc(50% - 8px)',
      borderTop: '8px solid transparent',
      borderBottom: '8px solid transparent',
      ...triangle({ triangleMarkPosition, bgColor })
    }
  } as const)

const triangle = ({ triangleMarkPosition, bgColor }: Pick<PresenterProps, 'triangleMarkPosition' | 'bgColor'>) => {
  if (triangleMarkPosition === 'left') {
    return {
      left: -13,
      borderRight: '13px solid',
      borderRightColor: bgColor
    }
  }
  if (triangleMarkPosition === 'right') {
    return {
      right: -13,
      borderLeft: '13px solid',
      borderLeftColor: bgColor
    }
  }
  return {
    borderLeft: '8px solid transparent',
    borderRight: '8px solid transparent'
  }
}

export const content = ({ textColor: color }: Pick<PresenterProps, 'textColor'>) =>
  ({
    color,
    fontSize: 'sm',
    whiteSpace: 'pre-wrap'
  } as const)
