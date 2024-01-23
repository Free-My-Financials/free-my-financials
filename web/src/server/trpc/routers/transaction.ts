import { z } from 'zod'
import { router, publicProcedure } from '../trpc'
import { TRPCError } from '@trpc/server'
import { isAuthed } from '../middleware/isAuthed'

export default router({
  create: publicProcedure
    .use(isAuthed)
    .input(
      z.object({
        type: z.enum(['INCOME', 'EXPENSE']),
        amount: z.number().positive().int(),
        date: z.date({
          coerce: true,
        }),
        category: z.string(),
        store: z.string(),
      })
    ).mutation(async ({ input, ctx }) => {
      if (!ctx.user)
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not found',
        })

      const newTransaction = await ctx.prisma.transaction.create({
        data: {
          type: input.type,
          amount: input.amount,
          date: input.date,
          category: {
            connectOrCreate: {
              where: {
                name_userId: {
                  name: input.category,
                  userId: ctx.user.id,
                }
              },
              create: {
                name: input.category,
                user: {
                  connect: {
                    id: ctx.user.id,
                  }
                }
              }
            }
          },
          store: {
            connectOrCreate: {
              where: {
                name_userId: {
                  name: input.store,
                  userId: ctx.user.id,
                }
              },
              create: {
                name: input.store,
                user: {
                  connect: {
                    id: ctx.user.id,
                  }
                }
              }
            }
          },
          user: {
            connect: {
              id: ctx.user.id,
            }
          }
        },
        include: {
          category: true,
          store: true,
        }
      })

      return newTransaction
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

      const transaction = await ctx.prisma.transaction.findUnique({
        where: {
          id: input.id,
        },
        include: {
          category: true,
          store: true,
        }
      })

      if (!transaction)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Transaction not found',
        })

      if (transaction.userId !== ctx.user.id)
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not authorized',
        })

      return transaction
    }),
  list: publicProcedure
    .use(isAuthed)
    .query(async ({ ctx }) => {
      if (!ctx.user)
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not found',
        })

      const transactions = await ctx.prisma.transaction.findMany({
        where: {
          userId: ctx.user.id,
        },
        include: {
          category: true,
          store: true,
        }
      })

      return transactions
    }),
  delete: publicProcedure
    .use(isAuthed)
    .input(
      z.object({
        id: z.string(),
      })
    ).mutation(async ({ input, ctx }) => {
      if (!ctx.user)
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not found',
        })

      const transaction = await ctx.prisma.transaction.findUnique({
        where: {
          id: input.id,
        },
        include: {
          category: true,
          store: true,
        }
      })

      if (!transaction)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Transaction not found',
        })

      if (transaction.userId !== ctx.user.id)
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not authorized',
        })

      const deletedTransaction = await ctx.prisma.transaction.delete({
        where: {
          id: input.id,
        }
      })

      return deletedTransaction
    }),
})
