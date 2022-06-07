import { z } from 'zod'

export const schema = z.object({
  email: z.string().nonempty(),
  password: z.string().nonempty(),
  rememberMe: z.boolean().optional()
})

export type FormSchema = z.infer<typeof schema>
