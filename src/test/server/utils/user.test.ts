import { expect, test, vi } from 'vitest'
import prisma from '~/server/utils/prisma/__mocks__'
import {
  createUser,
  getUserById,
  getUserByGithubId,
  getUserByUsername,
} from '~/server/utils/prisma/user'

vi.mock('~/server/utils/prisma')

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

const budget = {
  id: 'hi',
  name: 'Budget',
  amount: 0,
  start: new Date('2024-06-15'),
  end: new Date('2024-06-15'),
  createdAt: new Date('2024-06-15'),
  updatedAt: new Date('2024-06-15'),
  user: user,
  userId: user.id,
}

test('Creating user should return a user with the same name', async () => {
  prisma.user.create.mockResolvedValue(user)
  prisma.budget.create.mockResolvedValue(budget)

  const testUser = await createUser(user)

  expect(testUser?.username).toBe(user.username)
})

test('Creating user that already exists should return an error', async () => {
  prisma.user.findUnique.mockResolvedValue(user)

  expect(async () => await createUser(user)).rejects.toThrow()
})

test('Finding a user by Id should return a user with the same name', async () => {
  prisma.user.findUnique.mockResolvedValue(user)
  const testUser = await getUserById(user.id)

  expect(testUser?.username).toBe(user.username)
})

test('Finding a user by githubId should return a user with the same name', async () => {
  prisma.user.findUnique.mockResolvedValue(user)
  const testUser = await getUserByGithubId(user.githubId)

  expect(testUser?.username).toBe(user.username)
})

test('Finding a user by username should return a user with the same githubId', async () => {
  prisma.user.findUnique.mockResolvedValue(user)
  const testUser = await getUserByUsername(user.username)

  expect(testUser?.githubId).toBe(user.githubId)
})
