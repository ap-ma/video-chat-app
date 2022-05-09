import { isBlank } from 'utils/general/object'
import { getErrMsg } from 'utils/helper'
import { z } from 'zod'

/**
 * zodエラー発生時のエラーメッセージをカスタマイズする
 *
 * @param issue - ZodIssueOptionalMessage
 * @param ctx - ErrorMapCtx
 * @returns カスタマイズされたエラーメッセージ
 */
export const zodCustomErrorMap: z.ZodErrorMap = (issue, ctx) => {
  if (issue.code === z.ZodIssueCode.invalid_string) {
    if (issue.validation === 'email') {
      const message = getErrMsg('V_EMAIL_FORMAT')
      return { message }
    }
  }
  if (issue.code === z.ZodIssueCode.too_small) {
    if (issue.type === 'string') {
      const message = getErrMsg('V_REQUIRED')
      if (isBlank(ctx.data)) return { message }
    }
  }
  if (issue.code === z.ZodIssueCode.too_big) {
    if (issue.type === 'string') {
      const message = getErrMsg('V_MAX_LENGTH', { vml_length: issue.maximum })
      return { message }
    }
  }
  return { message: ctx.defaultError }
}
