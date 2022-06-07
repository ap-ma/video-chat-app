/* eslint-disable import/no-unresolved */
import { contactInfo, dummyMutation, pngImage as dataUrl } from '.storybook/dummies'
import { Meta, Story } from '@storybook/react'
import { SendImageMutation, SendImageMutationVariables } from 'graphql/generated'
import React from 'react'
import { MutaionLoading } from 'types'
import { toStr } from 'utils/general/helper'
import { isNullish } from 'utils/general/object'
import SendImageConfirmDialog, { SendImageConfirmDialogProps } from './index'

export default {
  title: '04_organisms/dialogs/SendImageConfirmDialog',
  component: SendImageConfirmDialog,
  argTypes: { onClose: { action: 'clicked' } }
} as Meta

type SendImageConfirmDialogStoryProps = SendImageConfirmDialogProps & {
  dataUrl: string
  sendImageLoading: MutaionLoading
}

const Template: Story<SendImageConfirmDialogStoryProps> = ({ dataUrl, sendImageLoading, ...props }) => {
  // file
  const byteString = atob(toStr(dataUrl?.split(',')[1]))
  const length = byteString.length
  const mime = dataUrl.match(/(:)([a-z/]+)(;)/)
  const mimeType = !isNullish(mime) ? mime[2] : ''
  const content = new Uint8Array(byteString.length)
  for (let i = 0; length > i; i++) content[i] = byteString.charCodeAt(i)
  const blob = new Blob([content], { type: mimeType })
  const image = new File([blob], `story.${mimeType?.split('/')[1]}`, { type: mimeType })

  // query
  const query = { contactInfo }

  // mutation
  const sendImage = dummyMutation<SendImageMutation['sendImage'], SendImageMutation, SendImageMutationVariables>(
    'SendImage',
    undefined,
    sendImageLoading
  )
  const mutation = { sendImage }

  return <SendImageConfirmDialog {...{ ...props, image, query, mutation }} />
}

export const Primary = Template.bind({})
Primary.storyName = 'プライマリ'
Primary.args = {
  isOpen: true,
  sendImageLoading: false,
  dataUrl
}
