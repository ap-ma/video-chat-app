export const container = {
  direction: { base: 'column', sm: 'row' },
  spacing: 6
} as const

export const badge = {
  size: 'sm',
  rounded: 'full',
  top: '-10px',
  colorScheme: 'red',
  'aria-label': 'remove Image'
} as const

export const fileInput = (acceptImageExts: string[]) =>
  ({
    type: 'file',
    accept: acceptImageExts.map((ext) => `image/${ext}`).join(', '),
    hidden: true
  } as const)
