import { z } from 'zod'
import { publicProcedure } from '../trpc'

export default publicProcedure
  .input(
    z.object({
      text: z.string().nullish(),
    }),
  )
  .query(({ input }) => {
    return {
      greeting: `hello ${input?.text ?? 'world'}`,
    }
  })
