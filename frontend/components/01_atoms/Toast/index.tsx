import { createStandaloneToast } from '@chakra-ui/toast'

/** Toast types */
const TOASTS = {
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
  },
  UnexpectedError: {
    title: 'Error.',
    description: 'Unexpected error occurred.',
    status: 'error',
    position: 'top',
    variant: 'subtle',
    isClosable: true
  }
} as const

/** toast */
const toast =
  (type: keyof typeof TOASTS): (() => void) =>
  () => {
    const toast = createStandaloneToast()
    toast(TOASTS[type])
  }

export default toast
