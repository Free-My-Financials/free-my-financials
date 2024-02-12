import prisma from '.'

const defaultBudget = () => {
  const today = new Date()
  const start = new Date(today.getFullYear(), today.getMonth(), 1)
  const end = new Date(today.getFullYear(), today.getMonth() + 1, 0)

  return {
    amount: 0,
    start,
    end,
  }
}

export async function createDefaultBudget(userId: string) {
  return await createBudget(userId, defaultBudget())
}

export async function createBudget(
  userId: string,
  data: {
    amount: number
    start: Date
    end: Date
  }
) {
  return await prisma.budget.create({
    data: {
      amount: data.amount,
      start: data.start,
      end: data.end,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  })
}

export async function getBudgetByUserId(userId: string) {
  return await prisma.budget.findUnique({
    where: {
      userId,
    },
  })
}

export async function updateBudgetByUserId(
  userId: string,
  data: {
    amount?: number
    start?: Date
    end?: Date
  }
) {
  return await prisma.budget.update({
    where: {
      userId,
    },
    data,
  })
}
