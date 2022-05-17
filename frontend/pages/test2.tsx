import { createStandaloneToast } from '@chakra-ui/toast'
import React from 'react'

const toast = createStandaloneToast()

const ToastContainer = toast({
  title: 'An error occurred.',
  description: 'Unable to create user account.',
  status: 'error',
  duration: 9000,
  isClosable: true
})

export default function ForgotPasswordForm(): JSX.Element {
  return (
    <>
      <button
        onClick={() =>
          toast({
            title: 'An error occurred.',
            description: 'Unable to create user account.',
            status: 'error',
            duration: 1000,
            isClosable: true
          })
        }
      >
        ボタン
      </button>
      {ToastContainer}
    </>
  )
}
