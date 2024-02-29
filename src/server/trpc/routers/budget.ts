import { z } from 'zod'
import { router, publicProcedure } from '../trpc'
import { TRPCError } from '@trpc/server'
import { isAuthed } from '../middleware/isAuthed'
import {
  getBudgetById,
  getBudgetsByUserId,
  updateBudgetById,
} from '~/server/utils/prisma/budget'

export default router({
  get: publicProcedure
    .use(isAuthed)
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      const budget = await getBudgetById(input.id)

      if (!budget)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Budget not found',
        })

      return budget
    }),

  list: publicProcedure.use(isAuthed).query(async ({ ctx }) => {
    const budgets = await getBudgetsByUserId(ctx.user.id)

    if (!budgets)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Budget not found',
      })

    return budgets
  }),

  update: publicProcedure
    .use(isAuthed)
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        amount: z.number().positive().int().optional(),
        start: z
          .date({
            coerce: true,
          })
          .optional(),
        end: z
          .date({
            coerce: true,
          })
          .optional(),
      })
    )
    .mutation(async ({ input }) => {
      const budget = await getBudgetById(input.id)

      if (!budget)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Budget not found',
        })

      const newBudget = await updateBudgetById(input.id, input)

      return newBudget
    }),
})
