/* eslint-disable import/no-unresolved */
import { container } from '.storybook/decorators'
/* eslint-enable import/no-unresolved  */
import { Meta, Story } from '@storybook/react/types-6-0'
import React from 'react'
import Editable, { EditableProps } from './index'

export default {
  title: '01_atoms/Editable',
  component: Editable,
  decorators: [(Story) => container({ margin: '70px' })(Story())]
} as Meta

const Template: Story<EditableProps> = ({ ...props }) => <Editable {...props} />

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = {
  isEditable: false,
  value: '入力値'
}
