import { ForwardRefExoticComponent, PropsWithoutRef, RefAttributes } from 'react'

//  ----------------------------------------------------------------------------
//  Application common types
//  ----------------------------------------------------------------------------

/** コンテナコンポーネントprops型定義 */
export type ContainerProps<ComponentProps, PresenterProps> = ComponentProps & {
  presenter: React.VFC<PresenterProps>
}

//  ----------------------------------------------------------------------------
//  React common types
//  ----------------------------------------------------------------------------

/** React forwardRef Component */
export type ForwardRefComponent<T, P> = ForwardRefExoticComponent<RefAttributes<T> & PropsWithoutRef<P>>

//  ----------------------------------------------------------------------------
//  React props types
//  ----------------------------------------------------------------------------

/** Attribute style */
export type WithStyle = Pick<React.HTMLAttributes<unknown>, 'style'>

/** Attribute className */
export type WithClassName = Pick<React.HTMLAttributes<unknown>, 'className'>

/** React children */
export type WithChildren = { children: React.ReactNode }
