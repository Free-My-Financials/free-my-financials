import { expect, test, vi } from 'vitest'
import prisma from '~/server/utils/prisma/__mocks__/prisma'
import { createUser } from '~/server/utils/prisma/user'

vi.mock('~/server/utils/prisma/prisma')

const user = {
  id: 'Hi',
  username: 'WhatIfPandoraHitBy35Planes',
  createdAt: new Date('2024-06-15'),
  updatedAt: new Date('2024-06-15'),
  transactions: [],
  budget: null,
  categories: [],
  stores: [],
  // Auth
  githubId: 99,
  sessions: [],
}

test('Creating user should return a user with the same name', async () => {
  prisma.user.create.mockResolvedValue({ ...user })
  const testUser = await createUser({
    username: user.username,
    githubId: user.githubId,
  })

  expect(testUser?.username).toBe(user.username)
})

test('Creating user that already exists should return an error', async () => {
  prisma.user.findUnique.mockResolvedValue({ ...user })
  const testUser = await createUser({
    username: user.username,
    githubId: user.githubId,
  })
  expect(testUser).toEqual(new Error('User already exists'))
})
