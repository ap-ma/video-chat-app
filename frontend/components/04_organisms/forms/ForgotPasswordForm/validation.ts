import { z } from 'zod'

export const schema = z.object({
  email: z.string().nonempty().email()
})

export type FormSchema = z.infer<typeof schema>
