/* eslint-disable import/no-unresolved */
import { container } from '.storybook/decorators'
/* eslint-enable import/no-unresolved  */
import { Meta, Story } from '@storybook/react'
import React from 'react'
import DeleteButton, { DeleteButtonProps } from './index'

export default {
  title: '03_molecules/DeleteButton',
  component: DeleteButton,
  argTypes: { onClick: { action: 'clicked' } },
  decorators: [(Story) => container({ display: 'inline-block', margin: '50px' })(Story())]
} as Meta

const Template: Story<DeleteButtonProps> = (args) => <DeleteButton {...args} />

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = {
  tip: '削除する'
}
