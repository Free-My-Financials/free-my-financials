// FIXME: Currently no auth is implemented, only a username is required

import { z } from 'zod'
import { router, publicProcedure } from '../trpc'
import { TRPCError } from '@trpc/server'
import { isAuthed } from '../middleware/isAuthed'
import { createUser, getUserByUsername } from '~/server/utils/prisma/user'

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
