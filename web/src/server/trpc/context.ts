import { inferAsyncReturnType } from '@trpc/server'
import prisma from '../utils/prisma'
import { User } from 'lucia'

export const createContext = async (event: any) => {
  return {
    user: event.context.user as User | null,
    prisma,
  }
}

export type Context = inferAsyncReturnType<typeof createContext>;
