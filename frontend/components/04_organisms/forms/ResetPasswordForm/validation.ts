import { VALIDATION_PASSWORD_PATTERN } from 'const'
import { getErrMsg } from 'utils/helper'
import { z } from 'zod'

// message
const passFormat = getErrMsg('V_PASS_FORMAT', { vpf_min: 8, vpf_max: 24 })
const passConfirmNotMatch = getErrMsg('V_PASS_CONFIRMATION_NOT_MATCH')

export const schema = z
  .object({
    password: z.string().nonempty().regex(VALIDATION_PASSWORD_PATTERN, passFormat),
    passwordConfirm: z.string().nonempty()
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: passConfirmNotMatch,
    path: ['passwordConfirm']
  })

export type FormSchema = z.infer<typeof schema>
