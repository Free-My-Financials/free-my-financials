import prisma from '.'

const defaultBudget = () => {
  const today = new Date()
  const start = new Date(today.getFullYear(), today.getMonth(), 1)
  const end = new Date(today.getFullYear(), today.getMonth() + 1, 0)

  return {
    name: 'Default',
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
    name: string
    amount: number
    start: Date
    end: Date
  }
) {
  return await prisma.budget.create({
    data: {
      ...data,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  })
}

export async function getBudgetById(id: string) {
  return await prisma.budget.findUnique({
    where: {
      id,
    },
  })
}

export async function getBudgetsByUserId(userId: string) {
  return await prisma.budget.findMany({
    where: {
      userId,
    },
  })
}

export async function updateBudgetById(
  id: string,
  data: {
    name?: string
    amount?: number
    start?: Date
    end?: Date
  }
) {
  return await prisma.budget.update({
    where: {
      id,
    },
    data,
  })
}
