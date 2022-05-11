import { connect } from 'components/hoc'
import React from 'react'
import { ContainerProps, WithChildren } from 'types'
import * as styles from './styles'

/** Tip Props */
export type TipProps = WithChildren & {
  /**
   * ホバー指定ルート要素のクラス名
   */
  rootClassName?: string
}

/** Presenter Props */
export type PresenterProps = TipProps

/** Presenter Component */
const TipPresenter: React.VFC<PresenterProps> = ({ children, ...props }) => (
  <span className={styles.tip(props)}>{children}</span>
)

/** Container Component */
const TipContainer: React.VFC<ContainerProps<TipProps, PresenterProps>> = ({ presenter, ...props }) => {
  return presenter({ ...props })
}

/** Tip */
export default connect<TipProps, PresenterProps>('Tip', TipPresenter, TipContainer)
