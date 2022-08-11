import { useDisclosure } from '@chakra-ui/react'
import { ColorProps, PositionProps } from '@chakra-ui/styled-system'

//  ----------------------------------------------------------------------------
//  Chakra UI props types
//  ----------------------------------------------------------------------------

/** Chakra UI props colors */
export type ChakraColors = ColorProps['color']

/** Chakra UI props position */
export type ChakraPosition = PositionProps['position']

//  ----------------------------------------------------------------------------
//  Chakra UI hooks types
//  ----------------------------------------------------------------------------

/** Chakra UI hooks Disclosure */
export type Disclosure = ReturnType<typeof useDisclosure>

/** Chakra UI hooks useDisclosure onOpen */
export type OnOpen = ReturnType<typeof useDisclosure>['onOpen']

/** Chakra UI hooks useDisclosure onClose */
export type OnClose = ReturnType<typeof useDisclosure>['onClose']
