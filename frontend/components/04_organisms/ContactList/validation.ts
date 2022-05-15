import { z } from 'zod'

export const schema = z.object({
  filter: z.string()
})

export type FormSchema = z.infer<typeof schema>
