import prisma from '.'
import { createOrGetCategory } from './category'
import { createOrGetStore } from './store'

export async function createTransaction(userId: string, data: {
  type: 'INCOME' | 'EXPENSE',
  amount: number,
  date: Date,
  category: string,
  store: string,
}) {
  const { id: categoryId } = await createOrGetCategory(userId, data.category)
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
    },
  })
}

export async function getTransactionById(id: string) {
  return await prisma.transaction.findUnique({
    where: {
      id,
    },
  })
}

export async function getTransactionsByUserId(userId: string) {
  return await prisma.transaction.findMany({
    where: {
      userId,
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
