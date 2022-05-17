import { VALIDATION_CODE_PATTERN, VALIDATION_USER_COMMENT_MAX_LEN } from 'const'
import { isNullish } from 'utils/general/object'
import { getErrMsg, isAllowedImageFile } from 'utils/helper'
import { z } from 'zod'

const _FileList = typeof FileList !== 'undefined' ? FileList : Object()

// message
const cordFormat = getErrMsg('V_CODE_FORMAT', { vcf_min: 4, vcf_max: 8 })
const imageFormat = getErrMsg('V_IMAGE_FORMAT')

export const schema = z.object({
  code: z.string().nonempty().regex(VALIDATION_CODE_PATTERN, cordFormat),
  name: z.string().nonempty(),
  comment: z.string().max(VALIDATION_USER_COMMENT_MAX_LEN).optional(),
  avatar: z
    .instanceof(_FileList)
    .optional()
    .refine((data) => isNullish(data?.item(0)) || isAllowedImageFile(data?.item(0)?.name), {
      message: imageFormat
    }),
  isAvatarEdited: z.boolean().optional()
})

export type FormSchema = z.infer<typeof schema>
