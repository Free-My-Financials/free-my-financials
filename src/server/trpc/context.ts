import { inferAsyncReturnType } from '@trpc/server'
import prisma from '../utils/prisma/prisma'
import { User } from 'lucia'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createContext = async (event: any) => {
  return {
    user: event?.context?.user as User | null,
    prisma,
  }
}

export type Context = inferAsyncReturnType<typeof createContext>
