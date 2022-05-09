import { IconButton, IconButtonProps } from '@chakra-ui/react'
import Baloon from 'components/01_atoms/Balloon'
import Tooltip, { Tip } from 'components/02_interactions/Tooltip'
import { connect } from 'components/hoc'
import React from 'react'
import { FaTrash } from 'react-icons/fa'
import { ContainerProps, Optional } from 'types'

/** DeleteButton Props */
export type DeleteButtonProps = Optional<IconButtonProps, 'aria-label'> & {
  /**
   * ホバー時にTipとして表示する文字列
   */
  tip?: string
}

/** Presenter Props */
type PresenterProps = DeleteButtonProps

/** Presenter Component */
const DeleteButtonPresenter: React.VFC<DeleteButtonProps> = ({ tip, ...props }) => (
  <Tooltip style={{ display: 'inline-block' }}>
    <IconButton icon={<FaTrash />} bg='transparent' aria-label='delete' {...props} />
    <Tip>
      <Baloon>{tip}</Baloon>
    </Tip>
  </Tooltip>
)

/** Container Component */
const DeleteButtonContainer: React.VFC<ContainerProps<DeleteButtonProps, PresenterProps>> = ({
  presenter,
  tip = 'Delete',
  ...props
}) => {
  return presenter({ tip, ...props })
}

/** DeleteButton */
export default connect<DeleteButtonProps, PresenterProps>('DeleteButton', DeleteButtonPresenter, DeleteButtonContainer)
