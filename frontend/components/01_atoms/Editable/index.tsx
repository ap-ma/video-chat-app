import { Input, InputProps } from '@chakra-ui/react'
import { connectRef } from 'components/hoc'
import React, { forwardRef, Ref } from 'react'
import { ContainerProps } from 'types'
import * as styles from './styles'

/** Editable Props */
export type EditableProps = InputProps &
  Partial<{
    isEditable: boolean
  }>

/** Presenter Props */
export type PresenterProps = EditableProps & {
  ref: Ref<HTMLInputElement>
}

/** Presenter Component */
const EditablePresenter = forwardRef<HTMLInputElement, PresenterProps>(({ isEditable, ...props }, ref) => (
  <Input {...styles.input({ isEditable })} {...props} ref={ref} />
))

/** Container Component */
const EditableContainer = forwardRef<HTMLInputElement, ContainerProps<EditableProps, PresenterProps>>(
  ({ presenter, ...props }, ref) => {
    return presenter({ ref, ...props })
  }
)

// display name
EditablePresenter.displayName = 'EditablePresenter'
EditableContainer.displayName = 'EditableContainer'

/** Editable */
export default connectRef<HTMLInputElement, EditableProps, PresenterProps>(
  'Editable',
  EditablePresenter,
  EditableContainer
)
