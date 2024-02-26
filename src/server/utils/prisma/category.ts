import prisma from '.'

const defaultCategories = () => ['Food', 'Clothing', 'Entertainment']

export async function createDefaultCategories(budgetId: string) {
  return await Promise.all(
    defaultCategories().map((category) => createCategory(budgetId, category))
  )
}

export async function createCategory(budgetId: string, name: string) {
  return await prisma.category.create({
    data: {
      name,
      budget: {
        connect: {
          id: budgetId,
        },
      },
    },
  })
}

export async function createOrGetCategory(budgetId: string, name: string) {
  const existingCategory = await getCategoryByBudgetIdAndName(budgetId, name)

  if (existingCategory) return existingCategory

  return await createCategory(budgetId, name)
}

export async function getCategoriesByBudgetId(budgetId: string) {
  return await prisma.category.findMany({
    where: {
      budgetId,
    },
  })
}

export async function getCategoryById(id: string) {
  return await prisma.category.findUnique({
    where: {
      id,
    },
  })
}

export async function getCategoryByBudgetIdAndName(
  budgetId: string,
  name: string
) {
  return await prisma.category.findUnique({
    where: {
      name_budgetId: {
        name,
        budgetId,
      },
    },
  })
}
