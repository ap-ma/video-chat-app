export const root = {
  overflowY: 'scroll',
  sx: {
    'scrollbarWidth': 'thin',
    '&::-webkit-scrollbar': {
      width: '5px'
    },
    '&::-webkit-scrollbar-thumb': {
      background: 'gray.300',
      borderRadius: '2.5px'
    }
  }
} as const
