import prisma from '.'

const defaultCategories = () => ['Food', 'Clothing', 'Entertainment']

export async function createDefaultCategories(userId: string) {
  return await Promise.all(
    defaultCategories().map((category) => createCategory(userId, category))
  )
}

export async function createCategory(userId: string, name: string) {
  return await prisma.category.create({
    data: {
      name,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  })
}

export async function createOrGetCategory(userId: string, name: string) {
  const existingCategory = await getCategoryByUserIdAndName(userId, name)

  if (existingCategory) return existingCategory

  return await createCategory(userId, name)
}

export async function getCategoriesByUserId(userId: string) {
  return await prisma.category.findMany({
    where: {
      userId,
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

export async function getCategoryByUserIdAndName(userId: string, name: string) {
  return await prisma.category.findUnique({
    where: {
      name_userId: {
        name,
        userId,
      },
    },
  })
}
