import { expect, test, vi } from 'vitest'
import { TransactionType } from '@prisma/client'
import prisma from '~/server/utils/prisma/__mocks__'
import {
  getTransactionsByUserId,
  getTransactionById,
  deleteTransactionById,
  createTransaction,
} from '~/server/utils/prisma/transaction'

vi.mock('~/server/utils/prisma')

const transactionData = {
  type: TransactionType.EXPENSE,
  amount: 99.99,
  date: new Date('2024-06-15'),
  category: 'Food',
  store: 'Walmart',
  budgetId: 'PandoraBudget',
}

const transactionExpense = {
  id: 'Will Smith',
  type: TransactionType.EXPENSE,
  amount: 99.99,
  date: new Date('2024-06-15'),
  createdAt: new Date('2024-06-15'),
  updatedAt: new Date('2024-06-15'),
  userId: 'Pandora',
  budgetId: 'PandoraBudget',
  categoryId: 'Food',
  storeId: 'Walmart',
}

const store = {
  id: '1738',
  name: 'Walmart',
  createdAt: new Date('2024-06-15'),
  updatedAt: new Date('2024-06-15'),
  userId: 'Pandora',
}

const category = {
  id: 'name',
  name: 'Food',
  createdAt: new Date('2024-06-15'),
  updatedAt: new Date('2024-06-15'),
  budgetId: 'PandoraBudget',
}

// i cant get creating transaction to work with testing

test('Creating a transaction returns the created transaction', async () => {
  prisma.store.findUnique.mockResolvedValue(store)
  prisma.category.findUnique.mockResolvedValue(category)
  prisma.transaction.create.mockResolvedValue(transactionExpense)
  const testTransaction = await createTransaction(
    transactionExpense.budgetId,
    transactionData
  )
  expect(testTransaction).toEqual(transactionExpense)
})

test('Getting transaction should return that transaction', async () => {
  prisma.transaction.findUnique.mockResolvedValue(transactionExpense)
  const testTransaction = await getTransactionById(transactionExpense.id)
  expect(testTransaction).toEqual(transactionExpense)
})

test('Getting transactions by user id should return that arrays with relevant transactions', async () => {
  prisma.transaction.findMany.mockResolvedValue([transactionExpense])
  const testTransaction = await getTransactionsByUserId(
    transactionExpense.userId
  )
  expect(testTransaction).toEqual([transactionExpense])
})

test('Deleting a transaction should return deleted transaction', async () => {
  prisma.transaction.delete.mockResolvedValue(transactionExpense)
  const testTransaction = await deleteTransactionById(transactionExpense.id)
  expect(testTransaction).toEqual(transactionExpense)
})
