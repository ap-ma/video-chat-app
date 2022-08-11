import React, { forwardRef, Ref } from 'react'
import { ContainerProps, ForwardRefComponent } from 'types'

/**
 * コンポーネント接続高階関数
 *
 * @param displayName - デバッグメッセージ用コンポーネント表示名
 * @param Presenter - Presenter
 * @param Container - Container
 * @returns 接続済みコンポーネント
 */
export function connect<ComponentProps, PresenterProps>(
  displayName: string,
  Presenter: React.VFC<PresenterProps>,
  Container: React.VFC<ContainerProps<ComponentProps, PresenterProps>>
): React.VFC<ComponentProps> {
  const Component: React.VFC<ComponentProps> = (props) => (
    <Container presenter={(presenterProps) => <Presenter {...presenterProps} />} {...props} />
  )
  Component.displayName = displayName
  return Component
}

/**
 * forwardRef使用コンポーネント接続高階関数
 *
 * @param displayName - デバッグメッセージ用コンポーネント表示名
 * @param Presenter - Presenter
 * @param Container - Container
 * @returns 接続済みコンポーネント
 */
export function connectRef<RefObject, ComponentProps, PresenterProps extends { ref: Ref<RefObject> }>(
  displayName: string,
  Presenter: ForwardRefComponent<RefObject, Omit<PresenterProps, 'ref'>>,
  Container: ForwardRefComponent<RefObject, ContainerProps<ComponentProps, PresenterProps>>
): ForwardRefComponent<RefObject, ComponentProps> {
  const Component = forwardRef<RefObject, ComponentProps>((props, ref) => (
    <Container presenter={({ ref, ...props }) => <Presenter ref={ref} {...props} />} ref={ref} {...props} />
  ))
  Component.displayName = displayName

  return Component
}
