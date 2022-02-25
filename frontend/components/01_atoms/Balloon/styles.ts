import { css } from '@emotion/css'

export const root = css`
  color: white;
  background-color: #1a1a1a;
  border-radius: 2px;
  display: inline-block;
  font-size: 0.8rem;
  padding: 0.4rem 0.5rem;
  position: relative;
  &::after {
    border-color: #1a1a1a transparent transparent transparent;
    border-style: solid;
    border-width: 3px 3px 0 3px;
    transform: translate(-50%, 100%);
    content: '';
    display: block;
    position: absolute;
    bottom: 0;
    left: 50%;
    height: 0;
    width: 0;
  }
`
