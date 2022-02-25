//  ----------------------------------------------------------------------------
//  Application common types
//  ----------------------------------------------------------------------------

/** コンテナコンポーネントprops型定義 */
export type ContainerProps<ComponentProps, PresenterProps> = ComponentProps & {
  presenter: React.VFC<PresenterProps>
}

//  ----------------------------------------------------------------------------
//  React props common types
//  ----------------------------------------------------------------------------

/** Attribute style */
export type WithStyle = Pick<React.HTMLAttributes<unknown>, 'style'>

/** Attribute className */
export type WithClassName = Pick<React.HTMLAttributes<unknown>, 'className'>

/** React children */
export type WithChildren = { children: React.ReactNode }
