import prisma from '.'

export async function createStore(userId: string, data: {
  name: string
}) {
  return await prisma.store.create({
    data: {
      ...data,
      user: {
        connect: {
          id: userId,
        }
      }
    }
  })
}

export async function createOrGetStore(userId: string, name: string) {
  const existingStore = await getStoreByUserIdAndName(userId, name)

  if (existingStore)
    return existingStore

  return await createStore(userId, { name })
}

export async function getStoresByUserId(userId: string) {
  return await prisma.store.findMany({
    where: {
      userId,
    },
  })
}

export async function getStoreByUserIdAndName(userId: string, name: string) {
  return await prisma.store.findUnique({
    where: {
      name_userId: {
        name,
        userId,
      },
    },
  })
}
