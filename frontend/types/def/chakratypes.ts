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

/** Chakra UI hooks useDisclosure isOpen */
export type IsOpen = ReturnType<typeof useDisclosure>['isOpen']

/** Chakra UI hooks useDisclosure onOpen */
export type OnOpen = ReturnType<typeof useDisclosure>['onOpen']

/** Chakra UI hooks useDisclosure onClose */
export type OnClose = ReturnType<typeof useDisclosure>['onClose']
