import { VALIDATION_CODE_PATTERN, VALIDATION_PASSWORD_PATTERN, VALIDATION_USER_COMMENT_MAX_LEN } from 'const'
import { isNullish } from 'utils/general/object'
import { getErrMsg, isAllowedImageFile } from 'utils/helper'
import { z } from 'zod'

const _FileList = typeof FileList !== 'undefined' ? FileList : Object()

// message
const cordFormat = getErrMsg('V_CODE_FORMAT', { vcf_min: 4, vcf_max: 8 })
const passFormat = getErrMsg('V_PASS_FORMAT', { vpf_min: 8, vpf_max: 24 })
const imageFormat = getErrMsg('V_IMAGE_FORMAT')
const passConfirmNotMatch = getErrMsg('V_PASS_CONFIRMATION_NOT_MATCH')

export const schema = z
  .object({
    code: z.string().nonempty().regex(VALIDATION_CODE_PATTERN, cordFormat),
    name: z.string().nonempty(),
    email: z.string().nonempty().email(),
    password: z.string().nonempty().regex(VALIDATION_PASSWORD_PATTERN, passFormat),
    passwordConfirm: z.string().nonempty(),
    comment: z.string().max(VALIDATION_USER_COMMENT_MAX_LEN).optional(),
    avatar: z
      .instanceof(_FileList)
      .optional()
      .refine((data) => isNullish(data?.item(0)) || isAllowedImageFile(data?.item(0)?.name), {
        message: imageFormat
      })
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: passConfirmNotMatch,
    path: ['passwordConfirm']
  })

export type FormSchema = z.infer<typeof schema>
