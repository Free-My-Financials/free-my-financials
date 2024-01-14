import { z } from 'zod'
import { router, publicProcedure } from '../trpc'
import { TRPCError } from '@trpc/server'
import { isAuthed } from '../middleware/isAuthed'

export const defaultCategories = [ 'Food', 'Clothing', 'Entertainment' ]

export default router({
  create: publicProcedure
    .use(isAuthed)
    .input(
      z.object({
        name: z.string(),
      })
    ).mutation(async ({ input, ctx }) => {
      if (!ctx.user)
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not found',
        })

      const existingCategory = await ctx.prisma.category.findUnique({
        where: {
          name_userId: {
            name: input.name,
            userId: ctx.user.id,
          }
        }
      })

      if (existingCategory)
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Category already exists',
        })

      const newCategory = await ctx.prisma.category.create({
        data: {
          name: input.name,
          user: {
            connect: {
              id: ctx.user.id,
            }
          }
        }
      })

      return newCategory
    }),
  get: publicProcedure
    .use(isAuthed)
    .input(
      z.object({
        id: z.string(),
      })
    ).query(async ({ input, ctx }) => {
      if (!ctx.user)
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not found',
        })

      const category = await ctx.prisma.category.findUnique({
        where: {
          id: input.id,
        }
      })

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
      if (!ctx.user)
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not found',
        })

      const categories = await ctx.prisma.category.findMany({
        where: {
          userId: ctx.user.id,
        }
      })

      return categories
    }),
})
