import { MessageProps } from './index'

export const root = ({
  triangleMarkPosition,
  bgColor,
  autoSizing
}: Pick<MessageProps, 'triangleMarkPosition' | 'bgColor' | 'autoSizing'>): Record<
  string,
  unknown
> =>
  ({
    pos: 'relative',
    p: 5,
    bgColor,
    d: autoSizing ? 'inline-block' : 'block',
    rounded: 'lg',
    boxShadow: 'md',
    _before: {
      content: '""',
      pos: 'absolute',
      w: 0,
      h: 0,
      top: '16px',
      borderTop: 'solid transparent',
      borderTopWidth: 15,
      borderBottom: 'solid transparent',
      borderBottomWidth: 15,
      ...triangle({ triangleMarkPosition, bgColor })
    }
  } as const)

const triangle = ({
  triangleMarkPosition,
  bgColor
}: Pick<MessageProps, 'triangleMarkPosition' | 'bgColor'>) => {
  if (triangleMarkPosition === 'left') {
    return {
      left: -15,
      borderRight: 'solid',
      borderRightWidth: 15,
      borderRightColor: bgColor
    }
  }
  if (triangleMarkPosition === 'right') {
    return {
      right: -15,
      borderLeft: 'solid',
      borderLeftWidth: 15,
      borderLeftColor: bgColor
    }
  }
  return {
    borderLeft: '15px solid transparent',
    borderRight: '15px solid transparent'
  }
}

export const content = ({ textColor: color }: Pick<MessageProps, 'textColor'>) =>
  ({
    color,
    fontSize: 'sm',
    whiteSpace: 'pre-wrap'
  } as const)
