import { z } from 'zod'
import { router, publicProcedure } from '../trpc'
import { TRPCError } from '@trpc/server'
import { isAuthed } from '../middleware/isAuthed'
import { createTransaction, deleteTransactionById, getTransactionById, getTransactionsByUserId } from '~/server/utils/prisma/transaction'

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

      const newTransaction = await createTransaction(ctx.user.id, input)
      console.log('newTransaction', newTransaction)

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
  list: publicProcedure
    .use(isAuthed)
    .query(async ({ ctx }) => {
      console.log('WHAT?')
      if (!ctx.user)
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not found',
        })

      const transactions = await getTransactionsByUserId(ctx.user.id)
      console.log('transactions', transactions)
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
})
