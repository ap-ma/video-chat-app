/* eslint-disable import/no-unresolved */
import { container } from '.storybook/decorators'
/* eslint-enable import/no-unresolved  */
import { Box } from '@chakra-ui/react'
import { Meta, Story } from '@storybook/react'
import React from 'react'
import AvatarEditor, { AvatarEditorProps } from './index'

export default {
  title: '03_molecules/AvatarEditor',
  component: AvatarEditor,
  decorators: [
    (Story) => (
      <Box w='md' m='40px' p={3} bg='white'>
        {Story()}
      </Box>
    ),
    (Story) => container({ height: '100vh', overflow: 'hidden', background: '#f5f5f5' })(Story())
  ]
} as Meta

type AvatarEditorStoryProps = Omit<AvatarEditorProps, 'avatar'> & {
  initialAvatar: AvatarEditorProps['avatar']
}

const Template: Story<AvatarEditorStoryProps> = ({ initialAvatar: avatar, ...props }) => (
  <AvatarEditor {...{ avatar, ...props }} />
)

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = {
  initialAvatar:
    'https://1.bp.blogspot.com/-WoPLgzbefuw/X-FcxFa-YjI/AAAAAAABdE0/42S9V3wWi400mGKLEiB_pQT-dqTKT28kwCNcBGAsYHQ/s1156/onepiece14_enel.png',
  isDisabled: false,
  isInvalid: false,
  errorMessage: 'Not an image file.'
}
