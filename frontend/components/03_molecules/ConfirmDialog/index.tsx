import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogProps,
  Button,
  ButtonProps,
  HStack,
  Text
} from '@chakra-ui/react'
import { connect } from 'components/hoc'
import React, { ReactText } from 'react'
import { ContainerProps, Optional } from 'types'
import { isArray, isBlank, isNullish } from 'utils/general/object'
import * as styles from './styles'

/** ConfirmDialog Props */
export type ConfirmDialogProps = Omit<Optional<AlertDialogProps, 'leastDestructiveRef'>, 'children'> & {
  /**
   * ヘッダー部テキスト
   */
  header: ReactText
  /**
   * ボディー部テキスト
   */
  body: string | string[] | undefined
  /**
   * Okボタン Props
   */
  ok: ButtonProps
  /**
   * Cancelボタン Props
   */
  cancel: ButtonProps
}

/** Presenter Props */
export type PresenterProps = Omit<ConfirmDialogProps, 'body'> & {
  body: string[] | undefined
  leastDestructiveRef: AlertDialogProps['leastDestructiveRef']
}

/** Presenter Component */
const ConfirmDialogPresenter: React.VFC<PresenterProps> = ({ header, body, ok, cancel, ...props }) => (
  <AlertDialog isCentered {...styles.root} {...props}>
    <AlertDialogOverlay {...styles.overlay} />
    <AlertDialogContent>
      <AlertDialogHeader {...styles.header}>{header}</AlertDialogHeader>
      <AlertDialogBody {...styles.body}>
        {body?.map((content, i) => (
          <Text key={i}>{content}</Text>
        ))}
      </AlertDialogBody>
      <AlertDialogFooter>
        <HStack {...styles.actions}>
          <Button {...cancel} />
          <Button {...ok} />
        </HStack>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
)

/** Container Component */
const ConfirmDialogContainer: React.VFC<ContainerProps<ConfirmDialogProps, PresenterProps>> = ({
  presenter,
  body,
  ok,
  cancel,
  leastDestructiveRef = undefined,
  ...props
}) => {
  body = isNullish(body) || isArray(body) ? body : [body]
  if (isBlank(ok.children)) ok.children = 'OK'
  if (isBlank(cancel.children)) cancel.children = 'Cancel'
  return presenter({ body, ok, cancel, leastDestructiveRef, ...props })
}

/** ConfirmDialog */
export default connect<ConfirmDialogProps, PresenterProps>(
  'ConfirmDialog',
  ConfirmDialogPresenter,
  ConfirmDialogContainer
)
