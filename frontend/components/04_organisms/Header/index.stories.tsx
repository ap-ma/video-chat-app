/* eslint-disable import/no-unresolved */
import { container } from '.storybook/decorators'
import { Box } from '@chakra-ui/react'
/* eslint-enable import/no-unresolved  */
import { Meta, Story } from '@storybook/react'
import React from 'react'
import Header, { HeaderProps } from './index'

export default {
  title: '04_organisms/Header',
  component: Header,
  decorators: [
    (Story) => (
      <div style={{ minHeight: '100vh' }}>
        <Box pos='absolute' w='18rem' h='100vh' bg='#dcdcdc' d={{ base: 'none', md: 'block' }} />
        {Story()}
      </div>
    ),
    (Story) => container({ height: '100%', background: '#f5f5f5' })(Story())
  ]
} as Meta

const Template: Story<HeaderProps> = ({ ...props }) => {
  return <Header {...props} />
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
