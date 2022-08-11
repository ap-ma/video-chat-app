import { z } from 'zod'

export const schema = z.object({
  code: z.string().nonempty()
})

export type FormSchema = z.infer<typeof schema>
