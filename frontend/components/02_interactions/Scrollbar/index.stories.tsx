/* eslint-disable import/no-unresolved */
import { container } from '.storybook/decorators'
/* eslint-enable import/no-unresolved  */
import { Meta, Story } from '@storybook/react/types-6-0'
import React, { Fragment } from 'react'
import Scrollbar, { ScrollbarProps } from './index'

export default {
  title: '02_interactions/Scrollbar',
  component: Scrollbar,
  decorators: [(Story) => container({ padding: '50px' })(Story())]
} as Meta

const children = (
  <Fragment>
    <div style={{ height: '100px', backgroundColor: '#0000ff' }}></div>
    <div style={{ height: '100px', backgroundColor: '#1e90ff' }}></div>
    <div style={{ height: '100px', backgroundColor: '#6495ed' }}></div>
    <div style={{ height: '100px', backgroundColor: '#00bfff' }}></div>
    <div style={{ height: '100px', backgroundColor: '#87cefa' }}></div>
    <div style={{ height: '100px', backgroundColor: '#87ceeb' }}></div>
    <div style={{ height: '100px', backgroundColor: '#add8e6' }}></div>
    <div style={{ height: '100px', backgroundColor: '#b0e0e6' }}></div>
    <div style={{ height: '100px', backgroundColor: '#afeeee' }}></div>
    <div style={{ height: '100px', backgroundColor: '#e0ffff' }}></div>
  </Fragment>
)

export const Primary: Story<ScrollbarProps> = ({ children, ...props }) => <Scrollbar {...props}>{children}</Scrollbar>
Primary.storyName = 'プライマリ'
Primary.args = {
  height: '70vh',
  children
}
