import { expectTypeOf, test } from 'vitest'
import prisma from '~/server/utils/prisma/index'
import { PrismaClient } from '@prisma/client'

test('Prisma should be of type prisma client', async () => {
  expectTypeOf(prisma).toMatchTypeOf(PrismaClient)
})
