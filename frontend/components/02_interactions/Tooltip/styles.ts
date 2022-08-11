import { css } from '@emotion/css'
import { PresenterProps as MarkerPresenterProps } from './Marker'
import { PresenterProps as TipPresenterProps } from './Tip'

export const root = css`
  position: relative;
`
export const tip = ({ rootClassName }: Pick<TipPresenterProps, 'rootClassName'>): string => css`
  display: none;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -100%) translateY(-12px);
  white-space: nowrap;
  ${'.' + rootClassName}:hover & {
    display: inline-block;
  }
`
export const marker = ({
  rootClassName,
  mkColor
}: Pick<MarkerPresenterProps, 'mkColor' | 'rootClassName'>): string => css`
  ${'.' + rootClassName}:hover & {
    background: linear-gradient(transparent 70%, ${mkColor} 0%);
  }
`
