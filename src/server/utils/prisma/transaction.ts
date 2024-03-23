import { TransactionType } from '@prisma/client'
import prisma from '.'
import { createOrGetCategory } from './category'
import { createOrGetStore } from './store'

export async function createTransaction(
  userId: string,
  data: {
    budgetId: string
    type: TransactionType
    amount: number
    date: Date
    category: string
    store: string
  }
) {
  const { id: categoryId } = await createOrGetCategory(
    data.budgetId,
    data.category
  )
  const { id: storeId } = await createOrGetStore(userId, data.store)

  return await prisma.transaction.create({
    data: {
      type: data.type,
      amount: data.amount,
      date: data.date,
      category: {
        connect: {
          id: categoryId,
        },
      },
      store: {
        connect: {
          id: storeId,
        },
      },
      user: {
        connect: {
          id: userId,
        },
      },
      budget: {
        connect: {
          id: data.budgetId,
        },
      },
    },
    include: {
      category: true,
      store: true,
      budget: true,
    },
  })
}

export async function getTransactionById(id: string) {
  return await prisma.transaction.findUnique({
    where: {
      id,
    },
    include: {
      category: true,
      store: true,
    },
  })
}

export async function getTransactionsByUserId(userId: string) {
  return await prisma.transaction.findMany({
    where: {
      userId,
    },
    include: {
      category: true,
      store: true,
    },
  })
}

export async function deleteTransactionById(id: string) {
  return await prisma.transaction.delete({
    where: {
      id,
    },
  })
}

export async function editTransaction(
  id: string,
  data: {
    amount?: number
    date?: Date
    categoryId?: string
    budgetId?: string
    storeId?: string
  }
) {
  return await prisma.transaction.update({
    where: {
      id,
    },
    data,
  })
}
