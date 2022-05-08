import { VALIDATION_CODE_PATTERN, VALIDATION_PASSWORD_PATTERN, VALIDATION_USER_COMMENT_MAX_LEN } from 'const'
import { isNullish } from 'utils/general/object'
import { isAllowedImageFile } from 'utils/helper'
import { z } from 'zod'

const _FileList = typeof FileList !== 'undefined' ? FileList : Object()

export const schema = z
  .object({
    code: z.string().regex(VALIDATION_CODE_PATTERN),
    name: z.string().nonempty(),
    email: z.string().email(),
    password: z.string().regex(VALIDATION_PASSWORD_PATTERN),
    passwordConfirm: z.string().nonempty(),
    comment: z.string().max(VALIDATION_USER_COMMENT_MAX_LEN).optional(),
    avatar: z
      .instanceof(_FileList)
      .optional()
      .refine((data) => isNullish(data?.item(0)) || isAllowedImageFile(data?.item(0)?.name), {
        message: '画像ファイルじゃないぞ！'
      })
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ['passwordConfirm']
  })

export type FormSchema = z.infer<typeof schema>
