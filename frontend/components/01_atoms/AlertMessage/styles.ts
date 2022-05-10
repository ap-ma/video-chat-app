export const alert = (index: number): Record<string, unknown> =>
  ({
    status: 'error',
    rounded: 'lg',
    mt: index > 0 ? '2' : '0'
  } as const)
