import { inferAsyncReturnType } from '@trpc/server'
import { PrismaClient } from '@prisma/client'
import { getUserFromHeader } from '../utils/auth'

let prisma: PrismaClient

export const createContext = async (event: any) => {
  if (!prisma)
    prisma = new PrismaClient()

  const authorization = getRequestHeader(event, 'authorization')
  const user = await getUserFromHeader(authorization, prisma)

  return {
    user,
    prisma,
  }
}

export type Context = inferAsyncReturnType<typeof createContext>;
