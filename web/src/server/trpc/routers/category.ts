import { z } from 'zod'
import { router, publicProcedure } from '../trpc'
import { TRPCError } from '@trpc/server'
import { isAuthed } from '../middleware/isAuthed'
import { createCategory, getCategoriesByUserId, getCategoryById } from '~/server/utils/prisma/category'

export const defaultCategories = ['Food', 'Clothing', 'Entertainment']

export default router({
  create: publicProcedure
    .use(isAuthed)
    .input(
      z.object({
        name: z.string(),
      })
    ).mutation(async ({ input, ctx }) => {
      const existingCategory = await getCategoryByUserIdAndName(ctx.user.id, input.name)

      if (existingCategory)
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Category already exists',
        })

      const newCategory = await createCategory(ctx.user.id, input.name)

      return newCategory
    }),
  get: publicProcedure
    .use(isAuthed)
    .input(
      z.object({
        id: z.string(),
      })
    ).query(async ({ input, ctx }) => {
      const category = await getCategoryById(input.id)

      if (!category)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Category not found',
        })

      if (category.userId !== ctx.user.id)
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not authorized',
        })

      return category
    }),
  list: publicProcedure
    .use(isAuthed)
    .query(async ({ ctx }) => {
      const categories = await getCategoriesByUserId(ctx.user.id)

      return categories
    }),
})
