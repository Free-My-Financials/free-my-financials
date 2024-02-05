import { router, publicProcedure } from '../trpc'
import { TRPCError } from '@trpc/server'
import { isAuthed } from '../middleware/isAuthed'
import { getUserById } from '~/server/utils/prisma/user'

export default router({
  get: publicProcedure
    .use(isAuthed)
    .query(async ({ ctx }) => {
      const user = await getUserById(ctx.user.id)

      if (!user)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        })

      return {
        user,
      }
    }),
})
