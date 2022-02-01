import React from 'react'
import { ContainerProps } from 'types'

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
