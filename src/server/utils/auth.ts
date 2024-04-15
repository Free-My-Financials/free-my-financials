import { Lucia } from 'lucia'
import { Google } from 'arctic'
import { PrismaAdapter } from '@lucia-auth/adapter-prisma'
import prisma from './prisma'

const config = useRuntimeConfig()

const adapter = new PrismaAdapter(prisma.session, prisma.user)

export const google = new Google(
  config.googleClientId!,
  config.googleClientSecret!,
  `${config.baseUrl}/auth/login/google/callback`
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
  googleId: string
  username: string
}
