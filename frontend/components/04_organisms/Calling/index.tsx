import {
  AspectRatio,
  HStack,
  IconButton,
  IconButtonProps,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  ModalProps,
  Stack,
  useBoolean
} from '@chakra-ui/react'
import { connect } from 'components/hoc'
import React, { Ref, useRef } from 'react'
import {
  BsFillCameraVideoFill,
  BsFillCameraVideoOffFill,
  BsFillMicFill,
  BsFillMicMuteFill,
  BsSquareFill
} from 'react-icons/bs'
import { ContainerProps } from 'types'
import * as styles from './styles'

/** Calling Props */
export type CallingProps = Omit<ModalProps, 'children'>

/** Presenter Props */
export type PresenterProps = CallingProps & {
  micState: boolean
  cameraState: boolean
  remoteVideoRef: Ref<HTMLVideoElement>
  localVideoRef: Ref<HTMLVideoElement>
  onMicButtonClick: IconButtonProps['onClick']
  onCameraButtonClick: IconButtonProps['onClick']
  onHangUpButtonClick: IconButtonProps['onClick']
}

/** Presenter Component */
const CallingPresenter: React.VFC<PresenterProps> = ({
  micState,
  cameraState,
  remoteVideoRef,
  localVideoRef,
  onMicButtonClick,
  onCameraButtonClick,
  onHangUpButtonClick,
  ...props
}) => (
  <Modal size='full' {...props}>
    <ModalOverlay bg='white' />
    <ModalContent {...styles.content}>
      <ModalBody {...styles.body}>
        <Stack {...styles.container}>
          <Stack {...styles.screen}>
            <AspectRatio {...styles.video}>
              <video poster='/black.png' ref={remoteVideoRef}></video>
            </AspectRatio>
            <AspectRatio {...styles.video}>
              <video poster='/black.png' ref={localVideoRef}></video>
            </AspectRatio>
          </Stack>
          <HStack {...styles.actions}>
            <IconButton
              {...styles.mediaButton}
              aria-label='mic'
              icon={micState ? <BsFillMicFill /> : <BsFillMicMuteFill />}
              onClick={onMicButtonClick}
            />
            <IconButton
              {...styles.mediaButton}
              aria-label='camera'
              icon={cameraState ? <BsFillCameraVideoFill /> : <BsFillCameraVideoOffFill />}
              onClick={onCameraButtonClick}
            />
            <IconButton
              {...styles.hangUpButton}
              aria-label='hang up'
              icon={<BsSquareFill />}
              onClick={onHangUpButtonClick}
            />
          </HStack>
        </Stack>
      </ModalBody>
    </ModalContent>
  </Modal>
)

/** Container Component */
const CallingContainer: React.VFC<ContainerProps<CallingProps, PresenterProps>> = ({
  presenter,
  isOpen,
  onClose,
  ...props
}) => {
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const localVideoRef = useRef<HTMLVideoElement>(null)

  const [micState, setMicState] = useBoolean(false)
  const [cameraState, setCameraState] = useBoolean(false)
  const onMicButtonClick = () => setMicState.toggle()
  const onCameraButtonClick = () => setCameraState.toggle()
  const onHangUpButtonClick = () => {
    setTimeout(onClose, 200)
  }

  return presenter({
    isOpen,
    onClose,
    micState,
    cameraState,
    remoteVideoRef,
    localVideoRef,
    onMicButtonClick,
    onCameraButtonClick,
    onHangUpButtonClick,
    ...props
  })
}

/** Calling */
export default connect<CallingProps, PresenterProps>('Calling', CallingPresenter, CallingContainer)
