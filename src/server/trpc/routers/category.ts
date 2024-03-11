import { z } from 'zod'
import { router, publicProcedure } from '../trpc'
import { TRPCError } from '@trpc/server'
import { isAuthed } from '../middleware/isAuthed'
import {
  createCategory,
  getCategoriesByBudgetId,
  getCategoryByBudgetIdAndName,
  getCategoryById,
} from '~/server/utils/prisma/category'
import { getBudgetById } from '~/server/utils/prisma/budget'

export const defaultCategories = ['Food', 'Clothing', 'Entertainment']

export default router({
  create: publicProcedure
    .use(isAuthed)
    .input(
      z.object({
        budgetId: z.string(),
        name: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const budget = await getBudgetById(input.budgetId)

      if (!budget || budget.userId !== ctx.user.id)
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not authorized',
        })

      const existingCategory = await getCategoryByBudgetIdAndName(
        input.budgetId,
        input.name
      )

      if (existingCategory)
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Category already exists',
        })

      const newCategory = await createCategory(input.budgetId, input.name)

      return newCategory
    }),

  get: publicProcedure
    .use(isAuthed)
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const category = await getCategoryById(input.id)

      if (!category)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Category not found',
        })

      const budget = await getBudgetById(category.budgetId)

      if (!budget || budget.userId !== ctx.user.id)
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not authorized',
        })

      return category
    }),

  list: publicProcedure
    .use(isAuthed)
    .input(
      z.object({
        budgetId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const budget = await getBudgetById(input.budgetId)

      if (!budget || budget.userId !== ctx.user.id)
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not authorized',
        })

      const categories = await getCategoriesByBudgetId(input.budgetId)

      return categories
    }),
})
