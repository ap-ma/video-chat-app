import { z } from 'zod'

export const schema = z.object({
  email: z.string(),
  password: z.string(),
  rememberMe: z.boolean().optional()
})

export type FormSchema = z.infer<typeof schema>
