// FIXME: Currently no auth is implemented, only a username is required

import { z } from 'zod'
import { router, publicProcedure } from '../trpc'
import { TRPCError } from '@trpc/server'
import { isAuthed } from '../middleware/isAuthed'

export default router({
  create: publicProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const existingUser = await ctx.prisma.user.findUnique({
        where: {
          username: input.username,
        }
      })

      if (existingUser)
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'User already exists',
        })

      const newUser = await ctx.prisma.user.create({
        data: {
          username: input.username,
        }
      })

      const token = createAccessToken(newUser.id)

      return {
        token,
        user: newUser
      }
    }),
  login: publicProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          username: input.username,
        }
      })

      if (!user)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        })

      const token = createAccessToken(user.id)

      return {
        token,
        user,
      }
    }),
  get: publicProcedure
    .use(isAuthed)
    .query(async ({ ctx }) => {
      return {
        user: ctx.user,
      }
    }),
})
