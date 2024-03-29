import { z } from 'zod'
import { router, publicProcedure } from '../trpc'
import { TRPCError } from '@trpc/server'
import { isAuthed } from '../middleware/isAuthed'
import {
  createTransaction,
  deleteTransactionById,
  getTransactionById,
  getTransactionsByUserId,
  editTransaction,
} from '~/server/utils/prisma/transaction'

export default router({
  create: publicProcedure
    .use(isAuthed)
    .input(
      z.object({
        budgetId: z.string(),
        type: z.enum(['INCOME', 'EXPENSE']),
        amount: z.number().positive().int(),
        date: z.date({
          coerce: true,
        }),
        category: z.string(),
        store: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const newTransaction = await createTransaction(ctx.user.id, input)

      return newTransaction
    }),
  get: publicProcedure
    .use(isAuthed)
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const transaction = await getTransactionById(input.id)

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
  list: publicProcedure.use(isAuthed).query(async ({ ctx }) => {
    const transactions = await getTransactionsByUserId(ctx.user.id)

    return transactions
  }),
  delete: publicProcedure
    .use(isAuthed)
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const transaction = await getTransactionById(input.id)

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

      const deletedTransaction = await deleteTransactionById(input.id)

      return deletedTransaction
    }),

  editTransaction: publicProcedure
    .use(isAuthed)
    .input(
      z.object({
        id: z.string(),
        amount: z.number().positive().int().optional(),
        date: z.date({ coerce: true }).optional(),
        categoryId: z.string().optional(),
        budgetId: z.string().optional(),
        storeId: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const updatedTransaction = await editTransaction(input.id, input)

      return updatedTransaction
    }),
})
