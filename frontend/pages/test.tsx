import { Editable, EditableInput, EditablePreview, Input } from '@chakra-ui/react'
import React from 'react'

type ForgotPasswordFormInputs = {
  email: string
}

export default function ForgotPasswordForm(): JSX.Element {
  return (
    <Editable isPreviewFocusable={false}>
      <EditablePreview />
      {/* Here is the custom input */}
      <Input as={EditableInput} />
    </Editable>
  )
}
