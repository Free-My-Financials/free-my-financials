import { z } from 'zod'
import { router, publicProcedure } from '../trpc'
import { TRPCError } from '@trpc/server'
import { isAuthed } from '../middleware/isAuthed'
import { getBudgetByUserId, updateBudgetByUserId } from '~/server/utils/prisma/budget'

export default router({
  get: publicProcedure
    .use(isAuthed)
    .query(async ({ ctx }) => {
      if (!ctx.user)
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not found',
        })

      const budget = await getBudgetByUserId(ctx.user.id)

      if (!budget)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Budget not found',
        })

      return budget
    }),

  update: publicProcedure
    .use(isAuthed)
    .input(
      z.object({
        amount: z.number().positive().int().optional(),
        start: z.date({
          coerce: true,
        }).optional(),
        end: z.date({
          coerce: true,
        }).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user)
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not found',
        })

      const budget = await getBudgetByUserId(ctx.user.id)

      if (!budget)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Budget not found',
        })

      const newBudget = await updateBudgetByUserId(ctx.user.id, input)

      return newBudget
    }),
})
