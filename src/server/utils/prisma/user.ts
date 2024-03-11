import prisma from '.'
import { createDefaultBudget } from './budget'
import { createDefaultCategories } from './category'

export async function createUser(data: {
  username: string
  githubId?: number
}) {
  const existingUser = await getUserByUsername(data.username)

  if (existingUser) throw new Error('User already exists')

  const newUser = await prisma.user.create({ data })

  const budget = await createDefaultBudget(newUser.id)
  await createDefaultCategories(budget.id)

  return newUser
}

export async function getUserById(id: string) {
  return await prisma.user.findUnique({
    where: {
      id,
    },
  })
}

export async function getUserByUsername(username: string) {
  return await prisma.user.findUnique({
    where: {
      username,
    },
  })
}

export async function getUserByGithubId(githubId: number) {
  return await prisma.user.findUnique({
    where: {
      githubId,
    },
  })
}
