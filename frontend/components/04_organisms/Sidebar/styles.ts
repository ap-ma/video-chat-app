export const root = {
  h: 'full',
  w: { base: 'full', md: 72 },
  bg: 'white',
  pos: 'absolute',
  transition: '3s ease',
  borderRight: '1px',
  borderRightColor: 'gray.200'
} as const

export const head = {
  h: '20',
  ml: '4',
  mr: '8',
  alignItems: 'center',
  justifyContent: 'space-between'
} as const

export const close = {
  d: { base: 'flex', md: 'none' }
} as const

export const tab = {
  variant: 'enclosed-colored'
} as const

export const contacts = {
  /* 全体 - (ヘッダー部 + tabボタン部 + 検索部 + padding部 + 余白部) */
  h: 'calc(100vh - (var(--chakra-sizes-20) + 34px + 40px + 3.2px + 8px))'
} as const

export const chats = {
  /* 全体 - (ヘッダー部 + tabボタン部 + padding部 + 余白部) */
  h: 'calc(100vh - (var(--chakra-sizes-20) + 34px + 4px + 8px))'
} as const
