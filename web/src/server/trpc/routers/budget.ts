import { z } from 'zod'
import { router, publicProcedure } from '../trpc'
import { TRPCError } from '@trpc/server'
import { isAuthed } from '../middleware/isAuthed'

export const defaultBudget = () => {
  const today = new Date()
  const start = new Date(today.getFullYear(), today.getMonth(), 1)
  const end = new Date(today.getFullYear(), today.getMonth() + 1, 0)

  return {
    amount: 0,
    start,
    end,
  }
}

export default router({
  get: publicProcedure
    .use(isAuthed)
    .query(async ({ ctx }) => {
      if (!ctx.user)
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not found',
        })

      const budget = await ctx.prisma.budget.findUnique({
        where: {
          userId: ctx.user.id,
        }
      })

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

      const budget = await ctx.prisma.budget.findUnique({
        where: {
          userId: ctx.user.id,
        }
      })

      if (!budget)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Budget not found',
        })

      const newBudget = await ctx.prisma.budget.update({
        where: {
          id: budget.id,
        },
        data: {
          amount: input.amount ?? budget.amount,
          start: input.start ?? budget.start,
          end: input.end ?? budget.end,
        }
      })

      return newBudget
    }),
})
