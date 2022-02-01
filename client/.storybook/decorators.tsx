import React from 'react'

type Style = React.HTMLAttributes<unknown>['style']

export const withSytle = (style: Style) => (component: JSX.Element) =>
  React.cloneElement(component, { style })

export const container = (style: Style) => (component: JSX.Element) =>
  <div style={style}>{component}</div>
