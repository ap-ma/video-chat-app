import { createStandaloneToast } from '@chakra-ui/toast'

/** Toast type */
export type ToastType = 'EditProfileComplete' | 'ValidationError'

/** Toast types */
const TOASTS: Record<ToastType, Record<string, unknown>> = {
  EditProfileComplete: {
    title: 'Success.',
    description: 'Updated profile.',
    status: 'success',
    position: 'bottom',
    variant: 'subtle',
    isClosable: true
  },
  ValidationError: {
    title: 'Error.',
    description: 'Please confirm your entry.',
    status: 'error',
    position: 'top',
    variant: 'subtle',
    isClosable: true
  }
}

/** Toast */
const Toast =
  (type: ToastType): (() => void) =>
  () => {
    const toast = createStandaloneToast()
    toast(TOASTS[type])
  }

export default Toast
