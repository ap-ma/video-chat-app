import { z } from 'zod'

export const schema = z.object({
  message: z.string().nonempty()
})

export type FormSchema = z.infer<typeof schema>
