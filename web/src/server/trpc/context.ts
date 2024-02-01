import { inferAsyncReturnType } from '@trpc/server'
import prisma from '../utils/prisma'

export const createContext = async (event: any) => {
  return {
    user: event.context.user,
    prisma,
  }
}

export type Context = inferAsyncReturnType<typeof createContext>;
