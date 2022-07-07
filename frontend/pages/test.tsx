import { useDisclosure } from '@chakra-ui/react'
import ReceiveCall from 'components/04_organisms/ReceiveCall'
import { NextPage } from 'next'
import React from 'react'

const Test: NextPage = () => {
  const disc = useDisclosure({ isOpen: true })
  return <ReceiveCall isOpen={disc.isOpen} onClose={disc.onClose} />
}

export default Test
