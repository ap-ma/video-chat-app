export const root = {
  py: '5',
  bg: 'gray.50',
  borderTopWidth: '1px',
  borderTopColor: 'gray.200'
} as const

export const container = {
  mx: 'auto',
  pl: '4',
  w: { base: '90%', xl: '75%' }
} as const

export const textarea = {
  bg: 'white',
  size: 'sm',
  resize: 'none',
  borderWidth: '2px',
  borderColor: 'gray.200',
  borderRadius: 'lg',
  _invalid: { backgroundColor: 'red.100' }
} as const

export const imageIcon = {
  size: 'sm',
  fontSize: 'xl',
  bg: 'transparent',
  color: 'gray.500',
  _hover: { bg: 'transparent' },
  _focus: { border: 0 }
} as const

export const fileInput = (acceptImageExts: string[]): Record<string, unknown> =>
  ({
    type: 'file',
    accept: acceptImageExts.map((ext) => `image/${ext}`).join(', '),
    hidden: true
  } as const)

export const phoneIcon = {
  size: 'sm',
  fontSize: 'xl',
  bg: 'transparent',
  color: 'gray.500',
  _hover: { bg: 'transparent' },
  _focus: { border: 0 },
  d: { base: 'none', md: 'inline-flex' }
} as const

export const sendIcon = {
  size: 'sm',
  fontSize: 'xl',
  bg: 'transparent',
  color: 'blue.600',
  _hover: { bg: 'transparent' },
  _focus: { border: 0 }
} as const
