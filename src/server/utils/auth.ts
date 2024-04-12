import { Lucia } from 'lucia'
import { GitHub } from 'arctic'
import { PrismaAdapter } from '@lucia-auth/adapter-prisma'
import prisma from './prisma'

const config = useRuntimeConfig()

const adapter = new PrismaAdapter(prisma.session, prisma.user)

export const github = new GitHub(
  config.githubClientId!,
  config.githubClientSecret!
)

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: !import.meta.dev,
    },
  },
  getUserAttributes: (attributes) => attributes,
})

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia
    DatabaseUserAttributes: DatabaseUserAttributes
  }
}

interface DatabaseUserAttributes {
  githubId: number
  username: string
}
